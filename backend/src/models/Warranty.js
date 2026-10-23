import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const Warranty=model('Warranty',new Schema({booking:{type:Schema.Types.ObjectId,ref:'Booking',unique:true,required:true},customer:{type:Schema.Types.ObjectId,ref:'User',required:true},technician:{type:Schema.Types.ObjectId,ref:'User',required:true},number:{type:String,unique:true,required:true},category:String,coveredFault:{type:String,required:true},exclusions:String,startsAt:Date,expiresAt:Date,days:Number,status:{type:String,enum:['active','expired','void'],default:'active'}},options));
