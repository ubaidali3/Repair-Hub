import crypto from 'node:crypto';
import {authenticator} from 'otplib';
const key=crypto.createHash('sha256').update(process.env.TWO_FACTOR_ENCRYPTION_KEY||process.env.JWT_SECRET).digest();
export function encrypt(value){const iv=crypto.randomBytes(12);const c=crypto.createCipheriv('aes-256-gcm',key,iv);const data=Buffer.concat([c.update(value,'utf8'),c.final()]);return Buffer.concat([iv,c.getAuthTag(),data]).toString('base64')}
export function decrypt(value){const b=Buffer.from(value,'base64');const d=crypto.createDecipheriv('aes-256-gcm',key,b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return Buffer.concat([d.update(b.subarray(28)),d.final()]).toString('utf8')}
export const hashCode=x=>crypto.createHmac('sha256',key).update(x).digest('hex');
export const tokenOk=(secret,token)=>Boolean(secret)&&/^\d{6}$/.test(String(token||''))&&authenticator.check(String(token),decrypt(secret));
