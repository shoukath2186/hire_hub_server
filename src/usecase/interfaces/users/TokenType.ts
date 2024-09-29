import { ObjectId } from 'mongoose';

export interface Token {
    _id:string | ObjectId ;
    user_name?: string;
    last_name?: string;
    otp_verify?:boolean,
    phone?: number;
    email?: string;
    user_role?: 'seeker' | 'employer'; 
    profilePicture?: string;
    accessToken?: string; 
  }