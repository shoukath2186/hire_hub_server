import mongoose, { Schema, Document, Model } from 'mongoose';


interface IApplication extends Document {
  coverLetter: string;
  profileId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  status: 'Pending' | 'Accepted' | 'Rejected';
}


const ApplicationSchema: Schema = new Schema(
  {
    coverLetter: {
      type: String,
      default:''
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_job_profiles',  
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',  
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],  
      default: 'Pending',
    },
  },
  { timestamps: true }  
);


const ApplicationModel: Model<IApplication> = mongoose.model<IApplication>('Application', ApplicationSchema);

export default ApplicationModel;
