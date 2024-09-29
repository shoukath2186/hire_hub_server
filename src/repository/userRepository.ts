

import UserRepo from "../usecase/interfaces/users/inUserRepo";
import UserModel from "../frameworks/models/userModel"; 
import OtpModel from '../frameworks/models/OTPModel'
import User from "../entities/user"; 


import { ObjectId } from 'mongodb';


class UserRepository implements UserRepo {
    
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });
    return userData ? (userData.toObject() as User) : null;
  }

  async saveUser(user: User): Promise<User | null> {
    
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    
    return savedUser ? (savedUser.toObject() as User) : null;
  }

  async saveOtp(
    email: string,
    otp: string,
  ): Promise<any> {

    try {
     
      const otpData = new OtpModel({ email, otp });
      
      const savedOtp = await otpData.save();
      
      return savedOtp;

    } catch (error) {
      console.error('Error saving OTP data:', error);
      throw error; 
    }
  }

  async deleteOtp(id: string | ObjectId) {
    try {
      const result = await OtpModel.deleteOne({ _id: id });
      // console.log(result);
    } catch (error) {
      console.log(error);
      
    }
   
        
  }

  async checkExistOtp(email:string){
    try {
      
      const otpData = await OtpModel.findOne({ email });
      const userData = await UserModel.findOne({ email });
       if(!userData){
        return 'User does not exist.';
      }
      if (!otpData) {
          return 'Email does not exist.';
      }

      return otpData.otp;
      
  } catch (error) {
      console.error('Error checking OTP:', error);
      return 'An error occurred while verifying OTP.';
  }

  }

  async retrieveUserByEmail(email:string){
      try {

        await UserModel.updateOne({email:email},{$set:{otp_verify:true}})
        
        const userData=await UserModel.findOne({ email },{user_name:1,last_name:1,_id:1,phone:1,email:1,profilePicture:1,user_role:1});
        if(!userData){
          return 'User does not exist.';
        }
        return userData
      } catch (error) {
        console.error('Error : retrieveUserByEmail', error);
      }
  }
  async alluserData(email:string){
    try {

      const userData=await UserModel.findOne({ email })
    if(!userData){
      return 'User does not exist.';
    }
    return userData

    } catch (error) {
      console.error('Error : retrieveUserByEmail', error);
    }
    
  }
  async saveTokan(token:string,email:string){ 
    try {
      const data= await UserModel.updateOne({email:email},{$set:{token:token}});
      
      // console.log(444,data); 
       
      if(data.matchedCount==0){
        return 'User not found. Please register as a new user.'
      }; 
      if(data.modifiedCount==1){ 
        return 'Success'
      }
      
      
    } catch (error) {
      console.error('Error : saveToken', error);
    }

  }
   
  async checkingToken(password:string,token:string){
    
    const userData=await UserModel.findOne({token:token})

    if(!userData){
     
      return'No user found with the provided token. Please check the token or contact support.'
      
    }
    const update=await UserModel.updateOne({token:token},{$set:{token:'',password:password}})
    
    if (update.matchedCount === 1) {
      return 'Password reset successfully.';
    } else {
      return 'Password reset failed. Please try again or contact support.';
    }
    
    

  }

  async findDataById(id: string): Promise<User | null> {
    const userData = await UserModel.findById(id);
    return userData ? (userData.toObject() as User) : null;
  }

  async checkUserBlock(id:string){
    let User=await UserModel.findById(id)
    return User?.isBlocked;
    
  }
  async FindbyIdforAccessToken(id:string){
     const User=await UserModel.findById({_id:id},{_id:1,user_role:1})
     if(User){
      return User
     }else{
      return false
     }
     
  }
}

export default UserRepository;
