import {Router} from 'express';
import {User} from '../models/index.js';
import {auth} from '../middleware/auth.js';
import {fail,allowedImage,profileUser as safeUser} from '../utils/helpers.js';
const r=Router();
r.patch('/profile',auth,async(req,res)=>{try{const {name,city,area,skills,avatarUrl,portfolioImages}=req.body;const update={};if(name!==undefined){if(typeof name!=='string'||name.trim().length<2||name.length>80)throw Error('Invalid name');update.name=name.trim()}for(const k of ['city','area'])if(req.body[k]!==undefined){if(typeof req.body[k]!=='string'||req.body[k].length>100)throw Error('Invalid location');update[k]=req.body[k]}if(skills!==undefined){if(req.user.role!=='technician'||!Array.isArray(skills)||skills.length>15||skills.some(x=>typeof x!=='string'||x.length>60))throw Error('Invalid skills');update.skills=skills}if(avatarUrl!==undefined){if(avatarUrl!==''&&!allowedImage(avatarUrl))throw Error('Invalid avatar URL');update.avatarUrl=avatarUrl}if(portfolioImages!==undefined){if(req.user.role!=='technician'||!Array.isArray(portfolioImages)||portfolioImages.length>12||!portfolioImages.every(allowedImage))throw Error('Invalid portfolio images');update.portfolioImages=portfolioImages}const u=await User.findByIdAndUpdate(req.user.id,{$set:update},{new:true,runValidators:true});res.json({user:safeUser(u)})}catch(e){fail(res,e)}});
export default r;
