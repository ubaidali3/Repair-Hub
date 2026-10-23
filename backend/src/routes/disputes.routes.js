import {Router} from 'express';
import {z} from 'zod';
import {Booking,Dispute} from '../models/index.js';
import {auth} from '../middleware/auth.js';
import {valid,bad,participant} from '../utils/helpers.js';
const r=Router();
r.post('/disputes',auth,async(req,res)=>{try{const d=z.object({booking:z.string(),claim:z.string().optional(),reason:z.string().min(10).max(2000)}).parse(req.body);const b=valid(d.booking)&&await Booking.findById(d.booking);if(!participant(b,req.user))return res.status(403).json({error:'Forbidden'});const item=await Dispute.create({...d,createdBy:req.user.id});res.status(201).json({item})}catch(e){bad(res,e)}});
export default r;
