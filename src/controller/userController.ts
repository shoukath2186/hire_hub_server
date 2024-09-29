import { NextFunction, Request, Response } from "express";
import UserUsecase from "../usecase/userUseCases";
import dotenv from "dotenv";
import { LoginDataType } from "../entities/IloginData";


dotenv.config();



class UserController {

  private _userUsecase: UserUsecase;

  constructor(userUsecase: UserUsecase) {
    this._userUsecase = userUsecase;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {


      const verifyUser = await this._userUsecase.checkExist(req.body.email);


      if (verifyUser.status === 200) {
        const user = await this._userUsecase.signup(
          req.body.userName,
          req.body.lastName,
          req.body.phone,
          req.body.email,
          req.body.password,
          req.body.userRole
        );
        //console.log(23456,user); 

        if (user._id) {
          this._userUsecase.deleteOtpData(user._id);
        }

        return res.status(user.status).json({ response: { message: user.message, data: user.data } });
      } else {
        return res.status(verifyUser.status).json(verifyUser.message);
      }
    } catch (error) {
      next(error);
    }
  }


  async verification(req: Request, res: Response, next: NextFunction) {
    try {


      const response = await this._userUsecase.verify_otp(req.body.otp, req.body.email);

      

      if (response.message == 'varification succussfull.') {

        const userDate: any = await this._userUsecase.fetchUserByEmail(req.body.email);

        if (userDate.message == 'User does not exist.') {
          return res.status(response.status).json(response.message);
        }



        const User = userDate.data
        const createToken = await this._userUsecase.createToken(User);


          res.cookie('refreshToken', createToken.refreshToken,  { 
            httpOnly: true, 
            maxAge: 10 * 24 * 60 * 60 * 1000, 
            secure: true,
            sameSite: 'strict', 
          });
          res.cookie('accessToken', createToken.accessToken, { 
            httpOnly: true, 
            maxAge: 1 * 60 * 60 * 1000,  
            secure: true,
            sameSite: 'strict', 
          });
          return res.status(200).json(User);

      }

      return res.status(response.status).json(response.message);


    } catch (error) {
      next(error);
    }
  }


  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this._userUsecase.createNewOtp(req.body.email);
      // console.log(response);


      if (response._id) {
        this._userUsecase.deleteOtpData(response._id);
      }

      return res.status(response.status).json(response.message);



    } catch (error) {
      next(error);
    }
  } 



 async login(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(1234,req.body); 
      
     const RequestData:LoginDataType=req.body
     const response=await this._userUsecase.verify_login(RequestData);
     
    
     if(response.status&&response.status==400){
      return res.status(response.status).json(response.message);
     }

        if(response.data){

        const User:any = response.data
        const createToken = await this._userUsecase.createToken(User);


        const UserData={
          _id:User._id,
          user_name:User.user_name,
          last_name:User.last_name,
          phone:User.phone,
          email:User.email,
          user_role:User.user_role,
          profilePicture:User.profilePicture
        }
       
        
         const { refreshToken, accessToken } = createToken;

         res.cookie('refreshToken', refreshToken, { 
          httpOnly: true, 
          maxAge: 10 * 24 * 60 * 60 * 1000, 
          secure: true,
          sameSite: 'strict', 
        });

         res.cookie('accessToken', accessToken, { 
          httpOnly: true, 
          maxAge: 1 * 60 * 60 * 1000,  
          secure: true,
          sameSite: 'strict', 
        });
        //  console.log(978654,createToken);
         return res.status(200).json(UserData);

        }

    } catch (error) {
      next(error)
    } 
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction){

    try {

      const forgotPassword:any=await this._userUsecase.forgotPassword(req.body.email);
        
      
      if(forgotPassword.status==400){
        return res.status(forgotPassword.status).json(forgotPassword.message);
      }
      
      return res.status(forgotPassword.status).json(forgotPassword.message);

      
    } catch (error) {
      next(error)  
    }

  }
  async resetPassword(req: Request, res: Response, next: NextFunction){
      try {
        
        const reset= await this._userUsecase.reset_Password(req.body.password,req.body.userId);
        
        res.status(reset.status).json(reset.message);
      } catch (error) {
        next(error)
      }
  }
  async logout(req: Request, res: Response, next: NextFunction){
      try {
        
        const responseData:any= await this._userUsecase.logout(req.body.userId)
        if(responseData.status==400){
          return res.status(responseData.status).json(responseData.message);
        }
        
        res.clearCookie('refreshToken'); 
        res.clearCookie('accessToken'); 
    
        
        res.status(200).json(responseData.message);

      } catch (error) {
        next(error)
      }
  }


  async googleLogin(req: Request, res: Response, next: NextFunction){
    try {
      const verifyUser = await this._userUsecase.checkExist(req.body.email);
    
      
      
      if(verifyUser.status==400){
         
        const user=await this._userUsecase.signInGoogle(req.body.email); 

        if(user.status==400){
          return res.status(user.status).json(user.message);
        }
          
        const User:any = user

        
        const createToken = await this._userUsecase.createToken(User);
        

        const UserData={
          _id:User._id,
          user_name:User.user_name,
          last_name:User.last_name,
          phone:User.phone,
          email:User.email,
          user_role:User.user_role,
          profilePicture:User.profilePicture
        }
       
        
         const { refreshToken, accessToken } = createToken;

         res.cookie('refreshToken', refreshToken, { 
          httpOnly: true, 
          maxAge: 10 * 24 * 60 * 60 * 1000, 
          secure: true,
          sameSite: 'strict', 
        });

         res.cookie('accessToken', accessToken, { 
          httpOnly: true, 
          maxAge: 1 * 60 * 60 * 1000,  
          secure: true,
          sameSite: 'strict', 
        });
        
         return res.status(200).json(UserData);

      }else{   
      
      const user = await this._userUsecase.signupGoogle(req.body);

    
      if(user.status==200){
    
        const User:any = user.data
        const createToken = await this._userUsecase.createToken(User);


        const UserData={
          _id:User._id,
          user_name:User.user_name,
          last_name:User.last_name,
          phone:User.phone,
          email:User.email,
          user_role:User.user_role,
          profilePicture:User.profilePicture
        }
       
        
         const { refreshToken, accessToken } = createToken;

         res.cookie('refreshToken', refreshToken, {  httpOnly: true });

         res.cookie('accessToken', accessToken, {  httpOnly: true });
        
         return res.status(200).json(UserData);
      }


      }
      

    } catch (error) {
       next(error)
    }
  }
  
}


export default UserController