import mongoose,{Model,Schema,Document} from "mongoose";

import IAdmin from '../../entities/IAdmin'

const otpSchema: Schema< IAdmin> = new Schema({
    name:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

})

const AdminModel: Model<IAdmin & Document> = mongoose.model<IAdmin & Document>(
    "Admin",
    otpSchema
  );
  
  export default AdminModel;

