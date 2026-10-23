import mongoose from 'mongoose';
const {Schema,model}=mongoose;
// Separate short-lived OTP challenges. Never store the OTP itself.
export const EmailOtpChallenge=model('EmailOtpChallenge',new Schema({
 tokenHash:{type:String,required:true,unique:true},email:{type:String,required:true,index:true},
 purpose:{type:String,enum:['login','register'],required:true},userId:Schema.Types.ObjectId,
 pending:{type:Schema.Types.Mixed},codeHash:{type:String,required:true,select:false},
 expiresAt:{type:Date,required:true},failedAttempts:{type:Number,default:0},
 lockedUntil:Date,lastSentAt:Date,usedAt:Date
},{timestamps:true}));
