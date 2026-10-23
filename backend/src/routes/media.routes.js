import {Router} from 'express';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import {auth} from '../middleware/auth.js';
const r=Router();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:5},fileFilter:(_req,file,cb)=>cb(null,['image/jpeg','image/png','image/webp'].includes(file.mimetype))});
r.post('/media/upload',auth,(req,res,next)=>upload.array('images',5)(req,res,err=>err?res.status(400).json({error:err.message}):next()),async(req,res)=>{try{if(!req.files?.length)return res.status(400).json({error:'Select JPG, PNG or WebP images (max 5MB each)'});if(!process.env.CLOUDINARY_CLOUD_NAME||!process.env.CLOUDINARY_API_KEY||!process.env.CLOUDINARY_API_SECRET)return res.status(503).json({error:'Cloudinary not configured'});cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});const urls=[];for(const file of req.files){const result=await new Promise((resolve,reject)=>{const stream=cloudinary.uploader.upload_stream({folder:'ustaadbid',resource_type:'image'},(e,result)=>e?reject(e):resolve(result));stream.end(file.buffer)});urls.push(result.secure_url)}res.status(201).json({urls})}catch(e){res.status(502).json({error:'Image upload failed'})}});
export default r;
