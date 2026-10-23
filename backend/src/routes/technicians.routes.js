import {Router} from 'express';
import {User} from '../models/index.js';
const r=Router();
r.get('/technicians',async(req,res)=>{const users=await User.find({role:'technician',verification:'approved',suspended:false}).select('name city area skills avatarUrl portfolioImages').limit(50);res.json({items:users})});
export default r;
