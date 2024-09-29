import JobRepository from "../repository/jobRepository"
import { Request } from "express";
import Cloudinary from "../frameworks/utils/cloudinary";
import { ObjectId } from "mongoose";
import { Express } from "express";
import {Multer} from 'multer'

interface CustomRequest extends Request {
  user?: string | ObjectId;
  file?: Express.Multer.File;
}


class JobUseCases{

  private _jobRepository:JobRepository
  private _cloudinary:Cloudinary
  constructor(

    jobRepository:JobRepository,
    cloudinary:Cloudinary

  ){

    this._jobRepository=jobRepository,
    this._cloudinary=cloudinary
  }
  
  async allCategory(){
    try {
       
      const allData=await this._jobRepository.findCategory()

      if(allData=='faild'){

        return{
          status: 400,
          message: 'faild Category fetching',
        }
       
      }
      return{
        status: 200,
        data: allData
      }


    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  } 

  async newJob(req:CustomRequest){
    try {
      
      const {companyName,contact,location,salary,title,type,description, category,skill,education} = req.body;

      const creater:any=req.user

      const save=await this._jobRepository.saveJob(companyName,contact,location,salary,title,type,description, category,skill,education,creater); 
      
      if(save){
        console.log('success');
        return{
          status:200,
          message: 'New job creation successful'
        }
      };
      
      return{
        status:400,
        message:'Failed to create job'
      }
      
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async getEmployerJob(Id:string|ObjectId){
      try {
        const allJob=await this._jobRepository.findEmployerJob(Id);


        if(allJob){
          return allJob
        }
        return{
          status:400,
          message:'Failed to get Employer job'
        }
        
      } catch (error) {
        return {
          status: 404,
          message: "An error occurred",
        };
      }
  }
  async deleteJob(id:string){
    try {
      
      const delet=await this._jobRepository.DeleteJob(id);
      if(delet){
        return{
          status:200,
          message:'deletetion successfull'
        }
      };
      return{
        status:400,
        message:'deletetion faild'
      }
      

    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async updateJob(req:CustomRequest){
    try {
      
      const {_id,name,contact,location,salary,title,job_type,description, category,skill,education} = req.body;
        //  console.log(88888,req.body);
        
       const Update=await this._jobRepository.UpdateJob(_id,name,contact,location,salary,title,job_type,description, category,skill,education); 

       if(Update){
          return {
            status:200,
            message:'successful'
          }
       }
       return {
        status:400,
        message:'falde update'
      }
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async takeJob(){
      try {
        const jobs=await this._jobRepository.findHomeJob()
        if(jobs){
          return {
            status:200,
            data:jobs
          }
        }
        return {
          status:400,
          message:'not find jobs'
        }

      } catch (error) {
        return {
          status: 404,
          message: "An error occurred",
        };
      }
  }
  async getJobs(limit:any){
      try {
        const jobs=await this._jobRepository.findHomeJob(limit)
        if(jobs){
          return {
            status:200,
            data:jobs
          }
        }
        return {
          status:400,
          message:'not find jobs'
        }
        
        
        
      } catch (error) {
        return {
          status: 404,
          message: "An error occurred",
        };
      }
  }
  async allLocation(){
     try {
       const data=await this._jobRepository.findLocation()
       if(data){
        return {
          status:200,
          data:data
        }
       }
       return {
        status:400,
        message:'not find Location'
      }

     } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
     }
  }
  async serchData(data:any){
    try {
      // console.log(data);
      
      const JobData=await this._jobRepository.searchJob(data);
      if(JobData){
        return {
          status:200,
          data:JobData
        }
        
      }
      return {
        status:400,
        message:'No jobs found matching the search criteria.'
      }

    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
    
  }
  async saveApplication(userId:string|ObjectId,cover:any){
    try {
      
      const res=await this._jobRepository.createApplication(cover.cover,userId,cover.EmplyerId,cover.jobId);
      if (res) {
        return {
            status: 200,
            message: "Application successfully created.",
        };
    } else {
        return {
            status: 400,
            message: "Failed to create the application. Please try again later.",
        };
    }
      
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }

  }
  async checkExists(UserId:string|ObjectId,Id:any){
    try {
      // console.log(1234);
      
       const check=await this._jobRepository.checkExists(UserId,Id);
       if(check){
        return{
          status:200,
          message:'No found Userdata'
        }
       }
       return{
        status:400,
        message:'User alrady applyde.'
      }
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async takeJobApplications(userId:string|ObjectId){
    try {

      const allApplication=await this._jobRepository.takeApplications(userId);
      if(allApplication){
        return {
          status: 200,
          data:allApplication,
        };
      }
      return {
        status:400,
        data:'data feching faild.'
      }
      
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async updateStatus(id:any,status:any){
     try {
      const updation=await this._jobRepository.updateStatus(id,status);
      if(updation){
        return {
          status: 200,
          message: "Updation successful.",
        };
      }
      return {
        status: 400,
        message: "Updation Faild",
      };
      
     } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
     }
  }
  async getProfileData(id:any){
    try {
      const profileData=await this._jobRepository.getProfile(id);
      if(profileData){
        return {
          status: 200,
          data: profileData,
        };
      }
      return {
        status: 400,
        message: "Profile Not found",
      };
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
    
  }

}

export default JobUseCases      