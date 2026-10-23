import {Router} from 'express';
import {z} from 'zod';
import {Booking,Review} from '../models/index.js';
import {auth,roles} from '../middleware/auth.js';
import {valid,bad} from '../utils/helpers.js';
const r=Router();
r.post('/bookings/:id/reviews',auth,roles('customer'),async(req,res)=>{try{const d=z.object({rating:z.number().int().min(1).max(5),comment:z.string().max(1000).default('')}).parse(req.body);const b=valid(req.params.id)&&await Booking.findById(req.params.id);if(!b||String(b.customer)!==req.user.id||b.status!=='completed')return res.status(403).json({error:'Completed booking required'});const item=await Review.create({...d,booking:b.id,customer:b.customer,technician:b.technician});res.status(201).json({item})}catch(e){if(e.code===11000)return res.status(409).json({error:'Already reviewed'});bad(res,e)}});
r.get('/technicians/:id/reviews',async(req,res)=>res.json({items:await Review.find({technician:req.params.id}).select('rating comment createdAt').limit(100)}));
export default r;
