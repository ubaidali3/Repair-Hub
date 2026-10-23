import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const Message=model('Message',new Schema({conversation:{type:Schema.Types.ObjectId,ref:'Conversation',required:true,index:true},sender:{type:Schema.Types.ObjectId,ref:'User',required:true},text:{type:String,required:true,maxlength:2000},readAt:Date},options));
