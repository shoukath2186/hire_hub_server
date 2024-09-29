import { ObjectId } from "mongoose";
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AdminData {
    _id: string|ObjectId;
    email: string;
  }

  export interface Verify extends JwtPayload {
    _id: string;
}



 