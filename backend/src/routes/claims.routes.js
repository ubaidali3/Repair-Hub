import {Router} from 'express';
import {z} from 'zod';
import {WarrantyClaim} from '../models/index.js';
import {auth} from '../middleware/auth.js';
import {valid,bad} from '../utils/helpers.js';
const r=Router();
r.get('/claims',auth,async(req,res)=>res.json({items:await WarrantyClaim.find(req.user.role==='technician'?{technician:req.user.id}:{customer:req.user.id}).sort({createdAt:-1})}));
r.patch('/claims/:id/status',auth,async(req,res)=>{try{const {status,note}=z.object({status:z.enum(['reviewing','revisit_scheduled','resolved','rejected','escalated']),note:z.string().max(500).default('')}).parse(req.body);const c=valid(req.params.id)&&await WarrantyClaim.findById(req.params.id);if(!c||!(String(c.customer)===req.user.id||String(c.technician)===req.user.id||req.user.role==='admin'))return res.status(403).json({error:'Forbidden'});if(req.user.role==='technician'&&!['reviewing','revisit_scheduled','rejected'].includes(status)||req.user.role==='customer'&&!['resolved','escalated'].includes(status))return res.status(403).json({error:'Transition not permitted'});if(['resolved','rejected'].includes(c.status))return res.status(409).json({error:'Claim closed'});c.status=status;c.history.push({status,note,by:req.user.id,at:new Date()});await c.save();res.json({item:c})}catch(e){bad(res,e)}});
export default r;
