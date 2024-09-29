
import mongoose, { ObjectId, Types } from "mongoose";
import CategoryModal from "../frameworks/models/categoryModel";
import JobModel from "../frameworks/models/JobModel";
import ApplicationModel from "../frameworks/models/applicationModel";
import JobProfileModal from '../frameworks/models/profileModel'; 


class JobRepository {

    async findCategory() {

        const allCalegory = await CategoryModal.find({is_block:false}, { _id: 1, name: 1 }) 

        if (allCalegory) {

            return allCalegory

        }
        return 'faild'

    }

    async saveJob(companyName: string, contact: string, location: string, salary: string, title: string, type: string, description: string, category: string, skill: string[], education: string, create: string | ObjectId) {
        try {

            const newJob = new JobModel({
                name: companyName, employer_id: create, category: category, contact: contact, location: location, salary: salary, title: title, description, job_type: type, skill: skill, education: education, applications: []
            });

            const savedJob = await newJob.save();

            if (savedJob) {
                return true
            }
            return false

        } catch (error) {
            console.log('Error in repository while saving job:', error);
            throw new Error('Job save failed');
        }

    }
    async findEmployerJob(id: string | ObjectId) {
        try {

            const allJob = await JobModel.find({ employer_id: id }, { employer_id: 0, applications: 0 }).sort({ _id: -1 })
            if (allJob) {
                return allJob
            }
            return false
        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }
    async DeleteJob(id: string) {
        try {

            const deletedata = await JobModel.deleteOne({ _id: id })

            if (deletedata.deletedCount == 1) {
                return true
            } else {
                return false
            };


        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }

    async UpdateJob(_id: string | ObjectId, companyName: string, contact: string, location: string, salary: string, title: string, job_type: string, description: string, category: string, skill: string[], education: string) {
        try {

            const updateData: { [key: string]: any } = {};

            if (companyName) updateData.name = companyName;
            if (contact) updateData.contact = contact;
            if (location) updateData.location = location;
            if (salary) updateData.salary = salary;
            if (title) updateData.title = title;
            if (job_type) updateData.job_type = job_type;
            if (description) updateData.description = description;
            if (category) updateData.category = category;
            if (skill) updateData.skill = skill;

            const updatedJob = await JobModel.findByIdAndUpdate(_id, { $set: updateData }, { new: true, runValidators: true });

            if (updatedJob) {
                return true
            }
            return false

        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }
    async findHomeJob(limit = 9) {
        try {
            const limitValue: number = Number(limit);
            const allJob = await JobModel.aggregate([
                {$match:{is_blocked:false}},
                {
                    $addFields: { employerIdAsObjectId: { $toObjectId: "$employer_id" } }
                },
                {
                    $lookup: { from: 'users', localField: 'employerIdAsObjectId', foreignField: '_id', as: 'employerDetails' }
                },
                {
                    $unwind: { path: '$employerDetails', }
                },
                {
                    $project: {
                        name: 1, contact: 1, location: 1, salary: 1, title: 1, job_type: 1, category: 1, skill: 1,
                        education: 1, description: 1, applications: 1, logo: 1, createdAt: 1, updatedAt: 1,
                        employerDetails: {
                            profilePicture: 1,
                            _id: 1
                        }
                    }
                }, { $sort: { _id: -1 } }, { $limit: limitValue }
            ]);


            if (allJob) {
                return allJob
            }
            return false
        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }
    async findLocation() {
        try {
            const location = await JobModel.find({}, { location: 1, _id: 0 })
            if (location) {
                return location
            }
            return false

        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }
    async searchJob(data: any) {
        try {
            const { key, category, location } = data;
            const pipeline: any[] = [];
            const matchCriteria: any[] = [];
        
            if (key) {
                matchCriteria.push({
                    $or: [
                        { title: { $regex: key, $options: "i" } },
                        { description: { $regex: key, $options: "i" } }
                    ]
                });
            }
        
            if (category) {
                matchCriteria.push({
                    category: { $regex: category, $options: "i" }
                });
            }
        
            if (location) {
                matchCriteria.push({
                    location: { $regex: location, $options: "i" }
                });
            }
        
            
            if (matchCriteria.length > 0) {
                pipeline.push({ $match: { $and: matchCriteria } });
            } else {
               
                pipeline.push({ $match: {} });
            }
        
            pipeline.push(
                {
                    $addFields: { employerIdAsObjectId: { $toObjectId: "$employer_id" } }
                },
                {
                    $lookup: { from: 'users', localField: 'employerIdAsObjectId', foreignField: '_id', as: 'employerDetails' }
                },
                {
                    $unwind: { path: '$employerDetails', preserveNullAndEmptyArrays: true }
                },
                {
                    $project: {
                        name: 1, contact: 1, location: 1, salary: 1, title: 1, job_type: 1, category: 1, skill: 1,
                        education: 1, description: 1, applications: 1, logo: 1, createdAt: 1, updatedAt: 1,
                        employerDetails: { profilePicture: 1, _id: 1 }
                    }
                },
                { $limit: 9 },
                { $sort: { _id: -1 } }
            );
        
            const jobs = await JobModel.aggregate(pipeline).exec();
        
            return jobs;
        
        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
        
    }
    async createApplication(cover: string, userId: string | ObjectId, employerId: string, jobId: string) {
        try {
             
            const jobProfile=await JobProfileModal.findOne({userId:userId})

            if(jobProfile){
            

            await JobModel.updateOne({ _id: jobId }, { $push: { applications: userId } });

            const Application = new ApplicationModel({
                coverLetter: cover,
                profileId: userId,
                employerId: employerId,
                jobId: jobId
            })

            const newApplication = await Application.save()
            if (newApplication) {
                return true
            }
            return false
        }
        return false

        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }

    }
    async checkExists(userId: string | ObjectId, Id: any) {
        try {

            const objectId = mongoose.Types.ObjectId.isValid(Id) ? new mongoose.Types.ObjectId(Id) : null;
         

            const response = await ApplicationModel.findOne({ jobId: objectId, profileId: userId })
            

            if (response) {
                return true
            }
            return false

        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');

        }
    }
    async takeApplications(userId: string | ObjectId|any) {
       
        try {
            const objectId= new mongoose.Types.ObjectId(userId)
            
            const applications = await ApplicationModel.aggregate([
                {
                  $match: { employerId: objectId }, 
                },{
                    $addFields: { profileIdStr: { $toString: "$profileId" } }
                },
                {
                  $lookup: { from: 'users',localField: 'profileId',  foreignField: '_id',as: 'profile', },
                },
                {
                  $lookup: {from: 'jobs',localField: 'jobId',foreignField: '_id',as: 'job',},
                },
                {
                  $lookup: {from: 'users', localField: 'employerId', foreignField: '_id',as: 'employer',},
                }, {$unwind: '$profile', },
                { $unwind: '$job',},
                {$unwind: '$employer', },
                {
                  $project: {_id: 1,jobTitle: '$job.title',applicantName: '$profile.user_name',email: '$profile.email',appliedDate: '$createdAt',status: 1,},
                },{$sort:{_id:-1}}
            ]);
              
              if(applications){
                return applications
              }
              return false
              

        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }

    }
    async updateStatus(id:any,status:any){
        try {
            const update=await ApplicationModel.updateOne({_id:id},{$set:{status:status}})
            if(update.modifiedCount==1){
                return true
            }
            return false
           
        }catch(error){
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }
    async getProfile(id:any){
        try {
          const application:any=await ApplicationModel.findById(id)
          const Profile=await JobProfileModal.findOne({userId:application.profileId})
          if(Profile){
            return Profile
          }else{
            return false
          };
          
            
        } catch (error) {
            console.log('Error in job repository:', error);
            throw new Error('Job repository failed');
        }
    }


}


export default JobRepository