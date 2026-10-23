import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const User=model('User',new Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:['customer','technician','admin'],default:'customer'},city:String,area:String,skills:[String],avatarUrl:String,portfolioImages:[String],twoFactorEnabled:{type:Boolean,default:false},twoFactorSecret:{type:String,select:false},twoFactorPending:{type:String,select:false},twoFactorRecoveryHashes:{type:[String],select:false},verification:{type:String,enum:['pending','approved','rejected'],default:'pending'},suspended:{type:Boolean,default:false}},options));
