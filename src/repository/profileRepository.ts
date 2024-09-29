import mongoose, { ObjectId } from 'mongoose';
import JobProfileModal from '../frameworks/models/profileModel'; 
import UserModel from '../frameworks/models/userModel';
import ApplicationModel from '../frameworks/models/applicationModel';
import JobModel from "../frameworks/models/JobModel";

const ObjectId = mongoose.Types.ObjectId;




class ProfileRepository {

    async createUserProfile(id: any) {

        try {

            const profile = await JobProfileModal.findOne({ userId: id });

            if (!profile) {

                const newProfile = new JobProfileModal({userId: id});

                let data = await newProfile.save(); 

                const User = data.userId

                const userProfile: any = await JobProfileModal.aggregate([{$match: { userId: User }},{
                        $lookup: {
                            from: 'users',
                            let: { userId: '$userId' },
                            pipeline: [
                                {
                                    $match: {$expr: {$eq: ['$_id', { $toObjectId: '$$userId' }]}}
                                },{
                                    $project: {_id: 0,user_name: 1,last_name: 1,email: 1,profilePicture:1}
                                }
                            ],as: 'userData'}},]);

                return userProfile;

            } else {
    
                return false
            }

        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }

    }
    async findUserJobProfile(Id:string|ObjectId){
        try {
            const PorfileData=await JobProfileModal.findOne({userId:Id});
            if(PorfileData){

                const User=PorfileData.userId
                const userProfileData: any = await JobProfileModal.aggregate([{$match: { userId: User }},{
                    $lookup: {
                        from: 'users',
                        let: { userId: '$userId' },
                        pipeline: [
                            {
                                $match: {$expr: {$eq: ['$_id', { $toObjectId: '$$userId' }]}}
                            },{
                                $project: {_id: 0,user_name: 1,last_name: 1,email: 1,profilePicture:1}
                            }
                        ],as: 'userData'}},]);

              return userProfileData;
              
            }else{
                return false
            }
        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }

    }
    async updateJobProfile(changeData:any,userId:string|ObjectId,url:string) {
        try {
            if(url){
                await JobProfileModal.updateOne({userId:userId},{$set:{resume:url}})
            }
            const updatedProfile = await JobProfileModal.findOneAndUpdate(
                { userId: userId },
                { $set: changeData },
                { new: true, runValidators: true }
            );
    
            if (!updatedProfile) {

                return false  
            }
             return updatedProfile;
            
            
        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
    }
    async getResume(userId:string|ObjectId){
        try {

            const profile=await JobProfileModal.findOne({userId:userId});
            if(profile){
                return profile.resume;
            }else{
                return false
            }
            
        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
    }
    async updateProfile(Id:string|ObjectId,data:any,prfile:any,password:any){
        try {
            if(prfile){
                await UserModel.updateOne({_id:Id},{$set:{profilePicture:prfile}})
            }
            if(password){
                await UserModel.updateOne({_id:Id},{$set:{password:password}})
            }

            const updatedProfile = await UserModel.findOneAndUpdate(
                { _id:Id  },
                { $set: data },
                { new: true, runValidators: true }
            );
             
            if(updatedProfile){
                const userData = await UserModel.findOne({ _id:Id },{user_name:1,last_name:1,_id:1,phone:1,email:1,profilePicture:1,user_role:1});
                if(userData){
                    return userData
                }else{
                    return false
                }
                
            }else{
                return false
            }
            
            
        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
    }
    async getProfile(id:string|ObjectId){
        try {
            
            const Profile=await UserModel.findOne({_id:id})
            
            if(Profile){
                return Profile.profilePicture;
                
            }else{
                return false
            }
            

        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
    }
    async findUserPassword(Id:string|ObjectId){
        try {
            
            const Profile=await UserModel.findOne({_id:Id})
            if(Profile){
                return Profile.password;
                
            }else{
                return false
            }

        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
    }
    async getAplication(userId:string|ObjectId|any){

        try {
            const objectId= new mongoose.Types.ObjectId(userId)

            // const takeApplication=await ApplicationModel.find({})

            // console.log(takeApplication);
            

            const responses = await ApplicationModel.aggregate([{ $match: { profileId: objectId } },
                { 
                  $lookup: {
                    from: 'jobs',localField: 'jobId',foreignField: '_id',as: 'jobData'         
                  }
                },
                { $unwind: { path: '$jobData', preserveNullAndEmptyArrays: true } },{ 
                  $project: {
                    status: 1,
                    createdAt: 1,
                    jobTitle: '$jobData.title' ,
                    companyName: '$jobData.name',
                    jobId:'$jobData._id'
                  }}
                ]);
              
            //   console.log(responses);
              
            return responses;
            
        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
    }
    async getJobData(id:any){
        try {
            const data = await JobModel.aggregate([
                {
                  $match: { _id:new ObjectId(id) }
                },
                {
                    $addFields: { employerIdAsObjectId: { $toObjectId: "$employer_id" } }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'employerIdAsObjectId', 
                    foreignField: '_id', 
                    as: 'employerDetails'
                  }
                },
                {
                    $unwind: { path: '$employerDetails', }
                },
                {
                 
                  $project: {name: 1,contact: 1,location: 1, salary: 1,title: 1, job_type: 1,
                    category: 1,
                    skill: 1,
                    education: 1,
                    description: 1,
                    applications: 1,
                    logo: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    employerDetails: {
                        profilePicture: 1,
                        _id: 1
                    }
                  }
                }
              ]);
              console.log(data);
              
                
            if(data){
                return data
            }
            return false
        } catch (error) {
            console.log('Error in Profile repository:', error);
            throw new Error('Profile repository failed');
        }
        
        
    }


}

export default ProfileRepository;