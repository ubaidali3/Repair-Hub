import mongoose from 'mongoose';
const {Schema,model}=mongoose;
const options={timestamps:true};
export const AdminAuditLog=model('AdminAuditLog',new Schema({admin:{type:Schema.Types.ObjectId,ref:'User',required:true},action:String,target:String,details:String},options));
