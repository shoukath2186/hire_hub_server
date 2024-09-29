import mongoose,{Model,Schema,Document} from "mongoose";

import IOtp from '../../entities/IOtp'

const otpSchema: Schema< IOtp> = new Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }

},{ timestamps: true })

const OtpModel: Model<IOtp & Document> = mongoose.model<IOtp & Document>(
    "Otp",
    otpSchema
  );
  
  export default OtpModel;

