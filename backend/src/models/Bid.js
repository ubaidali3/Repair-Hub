import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
const bidSchema=new Schema({request:{type:Schema.Types.ObjectId,ref:'RepairRequest',required:true},technician:{type:Schema.Types.ObjectId,ref:'User',required:true},price:{type:Number,required:true,min:1},durationHours:{type:Number,required:true,min:1},warrantyDays:{type:Number,required:true,min:0},message:String,status:{type:String,enum:['pending','accepted','closed','withdrawn'],default:'pending'}},options);
bidSchema.index({request:1,technician:1},{unique:true});
export const Bid=model('Bid',bidSchema);
