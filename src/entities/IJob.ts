
import { Document } from "mongoose";

export interface IJob extends Document {
    name: string;
    employer_id: string;
    contact: string;
    location: string;
    salary: string;
    is_blocked:boolean,
    title: string;  
    description:string,
    job_type: string;
    category:string;
    skill: string[];
    education:string;
    applications: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  