import mongoose,{Document,ObjectId} from "mongoose";

interface IAdmin extends Document {
    id?:string|ObjectId;
    name:string;
    email: string;
    password:string;
  }

export default IAdmin