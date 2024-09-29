import { ObjectId } from "mongoose";

export interface AuthToken{
    _id:string|ObjectId,
    user_role:string

}