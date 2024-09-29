import mongoose, { Model, Schema,Document } from "mongoose";

import { IJob } from "../../entities/IJob";


const JobSchema: Schema<IJob> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employer_id: {
      type: String,
      required: true,
      ref:'users'
    },
    contact: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    is_blocked:{
      type:Boolean,
      default:false
    },
    title: {
      type: String,
      required: true,
    },
    job_type: {
      type: String,
      required: true,
    },
    category:{
       type:String,
       required:true
    },
    skill: {
      type: [String], 
      required: true,
    },
    education:{
      type:String,
      required:true
    },
    description:{
      type:String,
      require:true
    },
    applications: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true,  
  }
);

const JobModel: Model<IJob & Document> = mongoose.model<IJob & Document>(
   "Job", JobSchema
  );
  
  export default JobModel;
