import mongoose,{Document} from "mongoose";

interface IOtp extends Document {
    otp: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

export default IOtp