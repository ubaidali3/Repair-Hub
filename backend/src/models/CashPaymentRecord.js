import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const CashPaymentRecord=model('CashPaymentRecord',new Schema({booking:{type:Schema.Types.ObjectId,ref:'Booking',unique:true,required:true},technicianMarkedAt:Date,customerConfirmedAt:Date,amount:{type:Number,min:0},status:{type:String,enum:['pending','technician_marked','customer_confirmed'],default:'pending'}},options));
