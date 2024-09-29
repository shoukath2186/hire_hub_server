import { NextFunction, Request, Response } from "express";
import ProfileUseCase from "../usecase/profileUseCase";
import { ObjectId } from "mongoose";

interface CustomRequest extends Request {
    user?: string | ObjectId;
    file?:any
}
class ProfileController{

    private _profileUseCase: ProfileUseCase

    constructor(ProfileUseCase: ProfileUseCase) {
        this._profileUseCase = ProfileUseCase
    }

    async createJobProfile(req: CustomRequest, res: Response, next: NextFunction){
        try {
            
           const profileData=await this._profileUseCase.createProfile(req);

           
           

           if(profileData.status==200){
              res.status(200).json(profileData.data)
           }else{
             res.status(profileData.status).json(profileData.message);
           }
            
        } catch (error) {
            next(error)
        }

    }

    async getProfileData(req: CustomRequest, res: Response, next: NextFunction){
        try {
             
            const profileData=await this._profileUseCase.getProfile(req);       
            if(profileData.status==200){
                res.status(200).json(profileData.data)
           }else{
             res.status(profileData.status).json(profileData.message);
           }
        } catch (error) {
            next(error)
        }

    }
    async updateJobProfile(req: CustomRequest, res: Response, next: NextFunction){
        try {
            
            
            if(req.user){
                const userId=req.user;
                const upDate=await this._profileUseCase.updateJobProfile(req.body,req.file,userId);
                 if(upDate.status==200){
                    res.status(200).json(upDate.data)
                 }else{
                    res.status(upDate.status).json(upDate.message)
                 }
            }else{
                res.status(401).json('Authentication failed. Please log in to continue.');
            }
            
        } catch (error) {
            next(error)
        }
    }

    async updateMainProfile(req: CustomRequest, res: Response, next: NextFunction){
        try {

            if(req.user){ 
              const UserData=await this._profileUseCase.updateMainProfile(req.user,req.body,req.file);
              if(UserData.status==200){
                res.status(200).json(UserData.data)
              }else{
                res.status(UserData.status).json(UserData.message)
              }

            }else{
                res.status(401).json('Authentication failed. Please log in to continue.');
            }

        } catch (error) {
            next(error)
        }
    }
    async seekerAplication(req: CustomRequest, res: Response, next: NextFunction){
        try {
            if(req.user){
                const response=await this._profileUseCase.getAplication(req.user);
                if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(response.status).json(response.message)
                }
            }else{
                res.status(401).json('Authentication failed. Please log in to continue.');
            }
            
        } catch (error) { 
            next(error)
        }

    }
   async getJobData(req: CustomRequest, res: Response, next: NextFunction){
    try {
        
        const response=await this._profileUseCase.getPorfileJob(req.query.jobId);
        if(response.status==200){
            res.status(200).json(response.data)
        }else{
            res.status(response.status).json(response.message)
        }
        
    } catch (error) {
        next(error)
    }
   }
    

}

export default ProfileController;