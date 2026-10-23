import {Router} from 'express';
import {Booking,CashPaymentRecord} from '../models/index.js';
import {auth} from '../middleware/auth.js';
import {valid,participant,notify} from '../utils/helpers.js';
const r=Router();
r.post('/bookings/:id/cash',auth,async(req,res)=>{const b=valid(req.params.id)&&await Booking.findById(req.params.id);if(!participant(b,req.user)||b.status!=='completed')return res.status(403).json({error:'Completed booking required'});let record=await CashPaymentRecord.findOne({booking:b.id});if(req.user.role==='technician'){if(record?.status==='customer_confirmed')return res.status(409).json({error:'Already confirmed'});record=await CashPaymentRecord.findOneAndUpdate({booking:b.id},{$set:{technicianMarkedAt:new Date(),status:'technician_marked'},$setOnInsert:{amount:b.price||0}},{upsert:true,new:true});await notify(b.customer,'Technician marked cash received. Please confirm.')}else{if(record?.status!=='technician_marked')return res.status(409).json({error:'Technician has not marked payment received'});record=await CashPaymentRecord.findOneAndUpdate({booking:b.id,status:'technician_marked'},{$set:{status:'customer_confirmed',customerConfirmedAt:new Date()}},{new:true});if(!record)return res.status(409).json({error:'Payment changed'})}res.json({item:record})});
r.get('/cash',auth,async(req,res)=>{const bs=await Booking.find(req.user.role==='technician'?{technician:req.user.id}:{customer:req.user.id}).select('_id');res.json({items:await CashPaymentRecord.find({booking:{$in:bs.map(b=>b.id)}})})});
export default r;
