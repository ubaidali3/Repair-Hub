import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {Notification} from '../models/index.js';

const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

// Cookie ke options ek jagah, login aur logout dono use karenge
export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax', // Vercel par alag domains ke liye 'none' zaroori
};

export const validate=(schema,req)=>schema.parse(req.body);
export const objectId=id=>mongoose.isValidObjectId(id);
export const error=(res,e)=>res.status(e instanceof z.ZodError?400:500).json({error:e instanceof z.ZodError?e.issues:'Unexpected server error'});
export const sessionCookie=(res,user)=>{
  const token=jwt.sign({sub:user.id},process.env.JWT_SECRET,{expiresIn:'8h'});
  res.cookie('access_token',token,{...cookieOptions,maxAge:28800000});
};
export const safeUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,verification:u.verification,avatarUrl:u.avatarUrl,portfolioImages:u.portfolioImages,twoFactorEnabled:true});
export const okId=id=>mongoose.isValidObjectId(id);
export const fail=(res,e)=>res.status(400).json({error:e.message||'Invalid request'});
export const profileUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,verification:u.verification,avatarUrl:u.avatarUrl,portfolioImages:u.portfolioImages,twoFactorEnabled:u.twoFactorEnabled});
export const allowedImage=x=>typeof x==='string'&&/^https:\/\/res\.cloudinary\.com\//.test(x);
export const valid=id=>mongoose.isValidObjectId(id);
export const bad=(res,e)=>res.status(e instanceof z.ZodError?400:500).json({error:e instanceof z.ZodError?e.issues:'Unexpected server error'});
export const participant=(b,u)=>b&&(String(b.customer)===String(u.id)||String(b.technician)===String(u.id));
export const notify=(user,text)=>Notification.create({user,text}).catch(()=>{});