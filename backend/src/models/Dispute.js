import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const Dispute=model('Dispute',new Schema({booking:{type:Schema.Types.ObjectId,ref:'Booking',required:true},claim:{type:Schema.Types.ObjectId,ref:'WarrantyClaim'},createdBy:{type:Schema.Types.ObjectId,ref:'User',required:true},reason:{type:String,required:true},status:{type:String,enum:['open','resolved','dismissed'],default:'open'},resolution:String},options));
