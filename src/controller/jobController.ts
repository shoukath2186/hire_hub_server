import { NextFunction, Request, Response } from "express";
import JobUseCases from "../usecase/jobUseCase"
import { ObjectId } from "mongoose";
import { RequestParams } from "nodemailer/lib/xoauth2";

interface CustomRequest extends Request {
    user?: string | ObjectId;
}


interface CustomRequest extends Request {
    refreshToken?: string;
    accessToken?: string;
}


class JobController {

    private _jobUseCase: JobUseCases

    constructor(jobUseCase: JobUseCases) {
        this._jobUseCase = jobUseCase
    }

    async getAllCategory(req: CustomRequest, res: Response, next: NextFunction) {

        try {

            const category = await this._jobUseCase.allCategory()

            if (category.status == 200) {
                res.status(200).json(category.data)
                return
            }
            res.status(category.status).json(category.message)

        } catch (error) {
            next(error)
        }


    }
    async createJob(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            const save = await this._jobUseCase.newJob(req);

            if (save.status == 200) {
                res.status(save.status).json(save.message)
                return
            } else {
                res.status(save.status).json(save.message)
                return
            }



        } catch (error) {
            next(error)
        }

    }
    async getEmployerJob(req: CustomRequest, res: Response, next: NextFunction){
        try {
            const employerId= req.user
            if(employerId){
                 const Jobs:any=await this._jobUseCase.getEmployerJob(employerId);
                 if(Jobs){
                     res.status(200).json(Jobs)
                     return
                 }

                 res.status(Jobs.status).json(Jobs.message)
                 
            }else{
                res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.')
            }
            
        } catch (error) {
            next(error)
        }
    }
    async delereJob(req: CustomRequest, res: Response, next: NextFunction){
      try{
        const deleteJob=await this._jobUseCase.deleteJob(req.body.Id);
        if(deleteJob.status==200){
            const employerId= req.user
            if(employerId){
                const Jobs:any=await this._jobUseCase.getEmployerJob(employerId);
                if(Jobs){
                    res.status(200).json(Jobs)
                    return
                }

                res.status(Jobs.status).json(Jobs.message)
                
           }else{
               res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.')
           }



        }else{
            res.status(deleteJob.status).json(deleteJob.message);
        }
    } catch (error) {
        next(error)
    }

    }
    async updateJobData(req: CustomRequest, res: Response, next: NextFunction){
     
        try {

            const update=await this._jobUseCase.updateJob(req);
            if(update.status==200){
                const employerId= req.user
            if(employerId){
                const Jobs:any=await this._jobUseCase.getEmployerJob(employerId);
                if(Jobs){
                    res.status(200).json(Jobs)
                    return
                }

                res.status(Jobs.status).json(Jobs.message)
            }

            }else{
                res.status(update.status).json(update.message)
            }
        
        } catch (error) {
            next(error)
        }
      
    }
    async takeJob(req: Request, res: Response, next: NextFunction){

        try {

            const data=await this._jobUseCase.takeJob()
            if(data.status==200){
                res.status(200).json(data.data)
            }else{
                res.status(data.status).json(data.message)
            }
            
        } catch (error) {
            next(error)
        }

    }

 async getJob(req: Request, res: Response, next: NextFunction){

    try {
        const limit:any =req.query.limit
       
        const data=await this._jobUseCase.getJobs(limit);

        if(data.status==200){
            res.status(200).json(data.data)
        }else{
            res.status(data.status).json(data.message)
        }
    } catch (error) {
        next(error)
    }
 }
 async allLocation(req: Request, res: Response, next: NextFunction){
    try {
        const allLocation=await this._jobUseCase.allLocation()
        if(allLocation.status==200){
            res.status(200).json(allLocation.data)
        }else{
            res.status(allLocation.status).json(allLocation.message)
        }
    } catch (error) {
        next(error)
    }
 }
 async searchJob(req: Request, res: Response, next: NextFunction){
       try {
            
           

       const searchData=await this._jobUseCase.serchData(req.query)
       if(searchData.status==200){
          res.status(200).json(searchData.data)
       }else{
        res.status(searchData.status).json(searchData.message)
       }
         
       } catch (error) {
        next(error)
       }

 }
 async createApplication(req: CustomRequest, res: Response, next: NextFunction){
    try {
        if(req.user){ 
            const resposns=await this._jobUseCase.saveApplication(req.user,req.body)
            res.status(resposns.status).json(resposns.message);
        }else{
            res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.')
        }
    } catch (error) {
        next(error)
    }
 }
 async checkExists(req: CustomRequest, res: Response, next: NextFunction){
    try {
       if(req.user){
        const response=await this._jobUseCase.checkExists(req.user,req.query.Id);
        
        res.status(response.status).json(response.message);

       } else{
        res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.')
       }
    } catch (error) {
        next(error)
    }
 }
 async jobApplications(req: CustomRequest, res: Response, next: NextFunction){
    try {
        if(req.user){
             const response=await this._jobUseCase.takeJobApplications(req.user);
             if(response.status==200){
                res.status(200).json(response.data)
             }else{
                res.status(response.status).json(response.message)
             }
        }else{
            res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.')
        }
    } catch (error) {
        next(error)
    }
 }
 async updateStatus(req: CustomRequest, res: Response, next: NextFunction){
    try {
        const {id,status}=req.query;
        const response=await this._jobUseCase.updateStatus(id,status);
        if(response.status==200){
            res.status(200).json(response.message)
         }else{
            res.status(response.status).json(response.message)
         }
        
    } catch (error) {
        next(error)
    }
 }
 async getProfile(req: CustomRequest, res: Response, next: NextFunction){
  try {
    const profile=await this._jobUseCase.getProfileData(req.query.id);
    if(profile.status==200){
        res.status(200).json(profile.data)
    }else{
        res.status(profile.status).json(profile.message)
    }
  } catch (error) {
    next(error)
  }
 }

}

export default JobController