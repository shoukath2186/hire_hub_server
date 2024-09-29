import { Document, ObjectId } from "mongoose";


interface ISocialLinks {
    github: string;
    linkedin: string;
    twitter: string;
}


interface IExperience {
    role: string;
    company: string;
    duration: string;
    description: string;
}


interface IEducation {
    degree: string;
    institution: string;
    year: string; 
}


export default interface IUserJobProfile extends Document {
    userId: string | ObjectId;
    bio: string;
    location: string;
    website: string;
    skills: string[];
    socialLinks: ISocialLinks;
    experience: IExperience[];
    education: IEducation[];
    hobbies: string[];
    resume: string;
    createdAt?: Date;
    updatedAt?: Date;
}
