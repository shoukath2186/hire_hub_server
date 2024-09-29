import express from "express";
import errorHandle from "../middlewares/errorHandle";
import ProtectRouter from "../middlewares/authMiddleware";
import multer from 'multer';

import JobController from '../../controller/jobController';
import JobUseCases from "../../usecase/jobUseCase";
import JobRepository from "../../repository/jobRepository";

import storage from "../middlewares/multer";

import Cloudinary from "../utils/cloudinary";

const upload = multer({ storage: storage });


const jobRepository=new JobRepository()

const cloudinary=new Cloudinary()

const jobUseCase=new JobUseCases(
    jobRepository,
    cloudinary
)

const jobController=new JobController(jobUseCase)


const jobRouter=express.Router()


jobRouter.get('/allCalegory',ProtectRouter,(req,res,next)=>{

    jobController.getAllCategory(req,res,next) 
})
jobRouter.post('/addNewJob',ProtectRouter,upload.single('logo'),(req,res,next)=>{
     
    jobController.createJob(req,res,next)
})
jobRouter.get('/getjobs',ProtectRouter,(req,res,next)=>{

    jobController.getEmployerJob(req,res,next)
})
jobRouter.put('/deleteJob',ProtectRouter,(req,res,next)=>{

    jobController.delereJob(req,res,next) 
})
jobRouter.patch('/UpdateJob',ProtectRouter,upload.single('logo'),(req,res,next)=>{

    jobController.updateJobData(req,res,next)
})
jobRouter.get('/homeJob',(req,res,next)=>{

      jobController.takeJob(req,res,next)
})
jobRouter.get('/getJob',ProtectRouter,(req,res,next)=>{
    
      jobController.getJob(req,res,next);
})
jobRouter.get('/allLocation',ProtectRouter,(req,res,next)=>{

    jobController.allLocation(req,res,next)
})
jobRouter.get('/search',ProtectRouter,(req,res,next)=>{

    jobController.searchJob(req,res,next)
})
jobRouter.post('/newApplication',ProtectRouter,(req,res,next)=>{
    
    jobController.createApplication(req,res,next)
});
jobRouter.get('/checkApplicationExists',ProtectRouter,(req,res,next)=>{ 

    jobController.checkExists(req,res,next);
})
jobRouter.get('/applications',ProtectRouter,(req,res,next)=>{
    
    jobController.jobApplications(req,res,next);
})
jobRouter.patch('/updateStatus',ProtectRouter,(req,res,next)=>{

   jobController.updateStatus(req,res,next);
})
jobRouter.get('/applicantProfile',ProtectRouter,(req,res,next)=>{

    jobController.getProfile(req,res,next);
})


jobRouter.use(errorHandle)

export default  jobRouter