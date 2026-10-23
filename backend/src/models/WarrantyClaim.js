import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const WarrantyClaim=model('WarrantyClaim',new Schema({warranty:{type:Schema.Types.ObjectId,ref:'Warranty',required:true},booking:{type:Schema.Types.ObjectId,ref:'Booking',required:true},customer:{type:Schema.Types.ObjectId,ref:'User',required:true},technician:{type:Schema.Types.ObjectId,ref:'User',required:true},description:{type:String,required:true},status:{type:String,enum:['submitted','reviewing','revisit_scheduled','resolved','rejected','escalated'],default:'submitted'},history:[{status:String,by:Schema.Types.ObjectId,at:Date,note:String}]},options));
WarrantyClaim.schema.index({warranty:1},{unique:true,partialFilterExpression:{status:{$in:['submitted','reviewing','revisit_scheduled','escalated']}}});
