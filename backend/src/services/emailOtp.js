import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import {EmailOtpChallenge} from '../models/index.js';

const OTP_TTL=5*60*1000;
const LOCK_MS=10*60*1000;
const error=(status,publicMessage)=>Object.assign(new Error(publicMessage),{status,publicMessage});
const hash=x=>crypto.createHmac('sha256',process.env.OTP_HASH_SECRET||process.env.JWT_SECRET).update(x).digest('hex');
const token=()=>crypto.randomBytes(32).toString('hex');
const otp=()=>crypto.randomInt(0,1000000).toString().padStart(6,'0');
function transport(){
 for(const key of ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','SMTP_FROM'])if(!process.env[key])throw error(503,'Email service is not configured');
 return nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT),secure:Number(process.env.SMTP_PORT)===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
}
async function send(email,code){await transport().sendMail({from:process.env.SMTP_FROM,to:email,subject:'UstaadBid verification code',text:`Your UstaadBid verification code is ${code}. It expires in 5 minutes. Do not share it.`,html:`<p>Your UstaadBid verification code:</p><h2>${code}</h2><p>Expires in 5 minutes. Never share it.</p>`})}
export async function issueEmailChallenge({email,purpose,pending,userId}){
 const now=new Date();
 const locked=await EmailOtpChallenge.findOne({email,lockedUntil:{$gt:now}});
 if(locked)throw error(429,'Too many wrong codes. Try again after 10 minutes');
 const recent=await EmailOtpChallenge.findOne({email,lastSentAt:{$gt:new Date(Date.now()-60_000)}});
 if(recent)throw error(429,'Please wait 60 seconds before requesting another code');
 const code=otp(),raw=token();
 const doc=await EmailOtpChallenge.create({tokenHash:hash(raw),email,purpose,pending,userId,codeHash:hash(code),expiresAt:new Date(Date.now()+OTP_TTL),lastSentAt:now});
 try{await send(email,code)}catch(e){await EmailOtpChallenge.deleteOne({_id:doc._id});throw error(503,'Could not send email. Check SMTP configuration')}
 return raw;
}
export async function verifyEmailChallenge(raw,code){
 const now=new Date();
 const doc=await EmailOtpChallenge.findOne({tokenHash:hash(raw)}).select('+codeHash');
 if(!doc||doc.usedAt)throw error(401,'Invalid or already used verification request');
 if(doc.lockedUntil&&doc.lockedUntil>now)throw error(429,'Too many wrong codes. Try again after 10 minutes');
 if(doc.expiresAt<=now)throw error(401,'Code expired. Request a new code');
 const valid=crypto.timingSafeEqual(Buffer.from(hash(code),'hex'),Buffer.from(doc.codeHash,'hex'));
 if(!valid){
  const updated=await EmailOtpChallenge.findOneAndUpdate({_id:doc._id,usedAt:null,failedAttempts:{$lt:6}},{$inc:{failedAttempts:1}},{new:true});
  if(!updated)throw error(429,'Too many wrong codes. Request a new code after 10 minutes');
  if(updated.failedAttempts>=6){
   await EmailOtpChallenge.updateMany({email:doc.email,usedAt:null},{$set:{lockedUntil:new Date(Date.now()+LOCK_MS)}});
   throw error(429,'Six incorrect codes. Login blocked for 10 minutes');
  }
  throw error(401,`Incorrect code. ${6-updated.failedAttempts} attempts remaining`);
 }
 const consumed=await EmailOtpChallenge.findOneAndUpdate({_id:doc._id,usedAt:null,failedAttempts:{$lt:6}},{$set:{usedAt:now}},{new:true});
 if(!consumed)throw error(401,'Code already used or locked');
 return {purpose:doc.purpose,email:doc.email,pending:doc.pending,userId:doc.userId};
}
export async function resendEmailChallenge(raw){
 const doc=await EmailOtpChallenge.findOne({tokenHash:hash(raw)});
 if(!doc||doc.usedAt||doc.expiresAt<new Date())throw error(401,'Verification request expired. Start again');
 if(doc.lockedUntil&&doc.lockedUntil>new Date())throw error(429,'Login blocked for 10 minutes');
 if(Date.now()-new Date(doc.lastSentAt).getTime()<60_000)throw error(429,'Wait 60 seconds before resending');
 const code=otp();
 const updated=await EmailOtpChallenge.findOneAndUpdate({_id:doc._id,usedAt:null,lockedUntil:{$not:{$gt:new Date()}}},{$set:{codeHash:hash(code),expiresAt:new Date(Date.now()+OTP_TTL),lastSentAt:new Date()}},{new:true});
 if(!updated)throw error(429,'Verification temporarily blocked');
 try{await send(doc.email,code)}catch{throw error(503,'Email could not be delivered. Try again later')}
}
