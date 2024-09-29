import { ObjectId } from 'mongodb';
export interface OtpData {
  otp: string;
  email: string;
  _id: ObjectId | string; // Use string if not using ObjectId
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}


interface OTP {
    createOtp(): number
}

export default OTP