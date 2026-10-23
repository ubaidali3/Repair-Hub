import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const Review=model('Review',new Schema({booking:{type:Schema.Types.ObjectId,ref:'Booking',unique:true,required:true},customer:{type:Schema.Types.ObjectId,ref:'User',required:true},technician:{type:Schema.Types.ObjectId,ref:'User',required:true},rating:{type:Number,min:1,max:5,required:true},comment:{type:String,maxlength:1000}},options));
