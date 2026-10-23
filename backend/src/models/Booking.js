import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
const bookingSchema=new Schema({customer:{type:Schema.Types.ObjectId,ref:'User',required:true},technician:{type:Schema.Types.ObjectId,ref:'User',required:true},request:{type:Schema.Types.ObjectId,ref:'RepairRequest'},bid:{type:Schema.Types.ObjectId,ref:'Bid'},category:String,description:String,city:String,area:String,preferredAt:Date,price:Number,warrantyDays:Number,source:{type:String,enum:['bid','direct'],required:true},status:{type:String,enum:['requested','confirmed','declined','in_progress','awaiting_confirmation','completed','cancelled'],required:true}},options);
bookingSchema.index({request:1},{unique:true,partialFilterExpression:{request:{$type:'objectId'}}});
export const Booking=model('Booking',bookingSchema);
