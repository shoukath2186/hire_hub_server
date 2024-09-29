import mongoose, { Schema } from 'mongoose';

import IUserJobProfile from '../../entities/IJobProfile';
const SocialLinksSchema: Schema = new Schema({
    github: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
});


const ExperienceSchema: Schema = new Schema({
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});


const EducationSchema: Schema = new Schema({
    degree: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
});


const UserJobProfileSchema: Schema = new Schema({
    userId: {
        type: String ,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    socialLinks: {
        type: SocialLinksSchema,
        default: {github:'',linkedin:'',twitter:''}
    },
    experience: {
        type: [ExperienceSchema],
        default: []
    },
    education: {
        type: [EducationSchema],
        default: [],
    },
    hobbies: {
        type: [String],
        default: []
    },
    resume: {
        type: String,
        default:''
    },
}, { timestamps: true });


export default mongoose.model<IUserJobProfile>('User_Job_Profile', UserJobProfileSchema);
