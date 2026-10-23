import {Router} from 'express';
import {Notification} from '../models/index.js';
import {auth} from '../middleware/auth.js';
const r=Router();
r.get('/notifications',auth,async(req,res)=>res.json({items:await Notification.find({user:req.user.id}).sort({createdAt:-1}).limit(100)}));
r.patch('/notifications/:id/read',auth,async(req,res)=>{const item=await Notification.findOneAndUpdate({_id:req.params.id,user:req.user.id},{read:true},{new:true});res.status(item?200:404).json(item?{item}:{error:'Not found'})});
export default r;
