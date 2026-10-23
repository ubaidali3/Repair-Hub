import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const Conversation=model('Conversation',new Schema({booking:{type:Schema.Types.ObjectId,ref:'Booking',required:true,unique:true},customer:{type:Schema.Types.ObjectId,ref:'User',required:true},technician:{type:Schema.Types.ObjectId,ref:'User',required:true}},options));
