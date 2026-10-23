import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const RepairRequest=model('RepairRequest',new Schema({customer:{type:Schema.Types.ObjectId,ref:'User',required:true},title:{type:String,required:true},description:{type:String,required:true},category:{type:String,required:true},city:{type:String,required:true},area:{type:String,required:true},status:{type:String,enum:['open','assigned','cancelled','completed'],default:'open'},images:[String],acceptedBid:{type:Schema.Types.ObjectId,ref:'Bid',default:null}},options));
