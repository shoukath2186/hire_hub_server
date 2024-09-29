import express from "express";
import errorHandle from "../middlewares/errorHandle";
import ProtectRouter from "../middlewares/authMiddleware";
import multer from 'multer';

import ProfileController from "../../controller/profileCnotroller";
import ProfileRepository from "../../repository/profileRepository";
import ProfileUseCase from "../../usecase/profileUseCase";

import storage from "../middlewares/multer";
import Cloudinary from "../utils/cloudinary";
import EncryptPassword from "../utils/bcryptPassword";


const upload = multer({ storage: storage });

const profileRepository=new ProfileRepository()
const cloudinary=new Cloudinary() 
const ecryptPassword = new EncryptPassword();

const profileUseCase=new ProfileUseCase(
    profileRepository,
    cloudinary,
    ecryptPassword
)

const  profileCnotroller= new ProfileController(profileUseCase);


const profileRouter=express.Router() 


profileRouter.post('/createProfile',ProtectRouter,(req,res,next)=>{

    profileCnotroller.createJobProfile(req,res,next)
})
profileRouter.get('/userJobProfile',ProtectRouter,(req,res,next)=>{

    profileCnotroller.getProfileData(req,res,next)
})
profileRouter.put('/updateJobProfile',ProtectRouter,upload.single('resume'),(req,res,next)=>{
    
    profileCnotroller.updateJobProfile(req,res,next);    
})
profileRouter.patch('/updateMain',ProtectRouter,upload.single('profilePicture'),(req,res,next)=>{

    profileCnotroller.updateMainProfile(req,res,next)
})
profileRouter.get('/seekerpAplications',ProtectRouter,(req,res,next)=>{

    profileCnotroller.seekerAplication(req,res,next)
})
profileRouter.get('/getApplicationJob',ProtectRouter,(req,res,next)=>{

    profileCnotroller.getJobData(req,res,next)
})




profileRouter.use(errorHandle)
export default profileRouter;