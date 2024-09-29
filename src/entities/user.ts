import { Document } from "mongoose";

interface IUser {
  user_name: string;
  last_name: string;
  phone: number | string;
  email: string;
  password: string;
  user_role: string;
  token?:string; 
  otp_verify?: boolean;
  profilePicture?: string;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUser;
