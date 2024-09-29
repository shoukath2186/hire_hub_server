
import express from "express";

import AdminController from "../../controller/adminController";
import AdminRepository from "../../repository/adminRepository";
import AdminUseCase from "../../usecase/adminUseCase";

import errorHandle from "../middlewares/errorHandle";

import EncryptPassword from "../utils/bcryptPassword";
import JWTToken from '../utils/generateToken';

const adminRouter=express.Router() 

//services 
const encryptPassword=new EncryptPassword()
const jwtToken = new JWTToken();
//repositories

const adminRepository = new AdminRepository()

//useCases

const adminUseCase=new AdminUseCase(
    adminRepository,
    encryptPassword,
    jwtToken,
)

import AdminMiddleware from "../middlewares/adminMiddlewares";


const adminController=new AdminController(adminUseCase)


adminRouter.post('/login',(req,res,next)=>{
   
    adminController.login(req,res,next);

})

adminRouter.get('/getUserData',AdminMiddleware,(req,res,next)=>{
     
    adminController.findAllUsers(req,res,next);
})


adminRouter.patch('/UserBlocking',AdminMiddleware,(req,res,next)=>{

    adminController.blockUser(req,res,next)
    
})

adminRouter.post('/addCategory',AdminMiddleware,(req,res,next)=>{

    adminController.addCategory(req,res,next)
    
})

adminRouter.get('/allCategory',AdminMiddleware,(req,res,next)=>{

    adminController.allCategorydata(req,res,next)

})


adminRouter.patch('/categoryBlocking',AdminMiddleware,(req,res,next)=>{

    adminController.blockCategory(req,res,next)

})
adminRouter.post('/logout',(req,res,next)=>{

    adminController.logout(req,res,next);  
    
})
adminRouter.patch('/editCategory',AdminMiddleware,(req,res,next)=>{

   adminController.editCategory(req,res,next)

})
adminRouter.delete('/deleteCategory',AdminMiddleware,(req,res,next)=>{
    
     adminController.degeteCategory(req,res,next)
})
adminRouter.get('/allJobs',AdminMiddleware,(req,res,next)=>{
    
    adminController.takeAlljobs(req,res,next);
})
adminRouter.patch('/blockJob',AdminMiddleware,(req,res,next)=>{

    adminController.blockJob(req,res,next)
})

 adminRouter.use(errorHandle);  


export default adminRouter