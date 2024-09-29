
import User from "../entities/user";
import EncryptOtp from "../frameworks/utils/bcryptOtp";
import EncryptPassword from "../frameworks/utils/bcryptPassword";
// import cloudinary from "../frameworks/utils/cloudinaryConfig";
import GenerateOtp from "../frameworks/utils/generateOtp";
import JWTToken from "../frameworks/utils/generateToken";
import sendOtp from "../frameworks/utils/sentMail";
import UserRepository from "../repository/userRepository";
import RandomStr from './interfaces/users/IRandomStr';
import { ForgetPass } from "./interfaces/users/inNodemailer";
import { OtpData } from "./interfaces/users/InOtp";
import { UserType } from "./interfaces/users/IUser";
import { LoginDataType } from "../entities/IloginData";
import IUser from "../entities/user";
import { GoogleUser } from "../entities/IGoogleUser";


import { ObjectId } from 'mongodb';
import { log } from "console";

class UserUsecase {
  private _userRepository: UserRepository;
  private _generateOtp: GenerateOtp;
  private _encryptPassword: EncryptPassword;
  private _encryptOtp: EncryptOtp;
  private _generateMail: sendOtp;
  private _jwtToken: JWTToken;
  private _stringGenerator: RandomStr;
  private _forgotPasswordLink: ForgetPass
  constructor(
    UserRepository: UserRepository,
    generateOtp: GenerateOtp,
    encryptPassword: EncryptPassword,
    encryptOtp: EncryptOtp,
    generateMail: sendOtp,
    jwtToken: JWTToken,
    stringGenerator: RandomStr,
    forgotPasswordLink: ForgetPass
  ) {
    this._userRepository = UserRepository;
    this._generateOtp = generateOtp;
    this._encryptPassword = encryptPassword;
    this._encryptOtp = encryptOtp;
    this._generateMail = generateMail;
    this._jwtToken = jwtToken;
    this._stringGenerator = stringGenerator;
    this._forgotPasswordLink = forgotPasswordLink
  }

  async checkExist(email: string) {
    try {
      const userExist = await this._userRepository.findByEmail(email);
      if (userExist) {
        return {
          status: 400,
          message: "User already exist",
        };
      } else {
        return {
          status: 200,
          message: "User does not exist",
        };
      }
    } catch (error) {
      return {
        status: 400,
        message: "An error occurred",
      };
    }
  }

  async signup(
    user_name: string, last_name: string, phone: number, email: string, password: string, user_role: string
  ) {
    try {
      const otp = this._generateOtp.createOtp();

      const hashedPassword: string = await this._encryptPassword.encrypt(password);

      const userDate: User = {
        user_name,
        last_name,
        email,
        phone,
        password: hashedPassword,
        user_role
      };
      await this._userRepository.saveUser(userDate)

      const hashedOtp = await this._encryptOtp.encrypt(otp);

      const otpdate: OtpData = await this._userRepository.saveOtp(
        email,
        hashedOtp,
      );

      await this._generateMail.sendMail(email, otp);



      return {
        status: 200,
        message: "Verification otp sent to your email",
        data: otpdate.email,
        _id: otpdate._id
      };
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }

  deleteOtpData(id: string | ObjectId) {
    try {
      setTimeout(() => {
        this._userRepository.deleteOtp(id)
      }, 60000)
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }


  }

  async verify_otp(otp: string, email: string) {
    try {
      const response: string = await this._userRepository.checkExistOtp(email);

      if (response == 'Email does not exist.') {
        return {
          status: 400,
          message: response,
        };
      }
      if (response == 'User does not exist.') {
        return {
          status: 400,
          message: response,
        };
      }

      //console.log(response);


      const hashedOtp = await this._encryptOtp.compare(parseInt(otp), response);

      //console.log(hashedOtp);

      if (hashedOtp) {
        return {
          status: 200,
          message: 'varification succussfull.',
        };

      } else {
        return {
          status: 400,
          message: 'OTP did not match.',
        };
      }


    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }

  }
  async createNewOtp(email: string) {
    try {
      const otp = this._generateOtp.createOtp();

      const hashedOtp = await this._encryptOtp.encrypt(otp);

      const otpData: OtpData = await this._userRepository.saveOtp(
        email,
        hashedOtp,
      );
      await this._generateMail.sendMail(email, otp);


      return {
        status: 200,
        message: 'OTP has been successfully created. Please check your email.',
        email: otpData.email,
        _id: otpData._id
      };

    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }


  async fetchUserByEmail(email: string) {
    try {


      const userData = await this._userRepository.retrieveUserByEmail(email)

      if (userData == 'User does not exist.') {
        return {
          status: 400,
          message: userData,
        }
      }
      return {
        status: 200,
        data: userData,
      }


    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async createToken(UserData: UserType) {
    try {

      const accessToken = this._jwtToken.accessToken(UserData);
      const refreshToken = this._jwtToken.refreshToken(UserData);

      return {
        accessToken,
        refreshToken
      }


    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }

  async verify_login(data: LoginDataType) {
    try {
      const userData: IUser | any = await this._userRepository.alluserData(data.email)
      //console.log(userData);



      if (userData == 'User does not exist.') {
        return {
          status: 400,
          message: userData,
        }
      }
      if (userData?.otp_verify == false) {
        return {
          status: 400,
          message: 'OTP is not verified.'
        }
      }
      if (userData?.isBlocked == true) {
        return {
          status: 400,
          message: 'User is Blocked.'
        }
      }
      //console.log(9999,userData);
      const hashedPassword: string = userData?.password

      const passwordMatch = await this._encryptPassword.compare(data.password, hashedPassword);

      // console.log(222,passwordMatch);


      if (passwordMatch) {
        return {
          status: 200,
          data: userData
        }
      } else {
        return {
          status: 400,
          message: 'The password you entered is incorrect. Please try again.'
        }
      }



    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }

  async forgotPassword(email: string) {
    try {

      const randomStr: string = await this._stringGenerator.randomstring()

      const res = await this._userRepository.saveTokan(randomStr, email);

      if (res == 'Success') {

        await this._forgotPasswordLink.sendMail(email, randomStr);


        return {
          status: 200,
          message: res
        }
      } else {
        return {
          status: 400,
          message: res
        }
      }




    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }
  async reset_Password(password: string, token: string) {

    try {
      const hashedPassword: string = await this._encryptPassword.encrypt(password);
      const check = await this._userRepository.checkingToken(hashedPassword, token);

      console.log(check);

      if (check == 'Password reset successfully.') {
        return {
          status: 200,
          message: 'Password reset successfully. Please log in again.'
        }
      }
      return {
        status: 400,
        message: check
      }

    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
  }

  async logout(id: string) {
    try {
      const response = await this._userRepository.findDataById(id);
    if (response) {
      return {
        status: 200,
        message: "User exist",
      };
       
    } else {
      return {
        status: 400,
        message: "User Not Found.",
      };

    }

    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }

    
  }
  async signupGoogle(data:GoogleUser){
    try {
      const hashedPassword: string = await this._encryptPassword.encrypt(data.id);
    
      const userDate: User = {
        user_name:data.given_name,
        last_name:data.family_name||'',
        email:data.email,
        phone:0,
        profilePicture:data.picture,
        otp_verify:true,
        password: hashedPassword,
        user_role:'seeker' 
      };
      
      
      const save=await this._userRepository.saveUser(userDate)

      return  {
        status: 200,
        data: save,
      }; 
      
      
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
    
  }

  async signInGoogle(email:string){
    try {
      const userData: IUser | any = await this._userRepository.alluserData(email)

      if(userData.isBlocked){
        return{
          status:400,
          message:'User is Blocked.'
        }
      }
    return userData
    
    } catch (error) {
      return {
        status: 404,
        message: "An error occurred",
      };
    }
    
  }

}



export default UserUsecase;