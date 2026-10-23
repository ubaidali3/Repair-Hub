import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const Notification=model('Notification',new Schema({user:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},text:{type:String,required:true},read:{type:Boolean,default:false}},options));
