import mongoose, { Model, Schema, Document } from "mongoose";
import User from "../../entities/user";

const userSchema: Schema<User & Document> = new Schema({

  user_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_role:{
     type:String,
     required:true
  },
  token:{ 
    type:String,
    default:''
  },
  otp_verify:{
    type:Boolean,
    default:false
  },
  profilePicture: {
    type: String,
    default:'hello'
  },
  isBlocked: {
    type: Boolean,
    default: false,
  }  
},
{ timestamps: true }
);

const UserModel: Model<User & Document> = mongoose.model<User & Document>(
  "User",
  userSchema
);

export default UserModel;