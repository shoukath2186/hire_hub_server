
import express from 'express'

import MessageController from '../../controller/messageController';
import MessageRepository from '../../repository/messageRepository';
import MessageUseCase from '../../usecase/messageUseCase';
import multer from 'multer';
import storage from "../middlewares/multer";

import ProtectRouter from "../middlewares/authMiddleware";
import errorHandle from '../middlewares/errorHandle';
import Cloudinary from "../utils/cloudinary";




const messageRepository=new MessageRepository()
const cloudinary=new Cloudinary() 

const messageUseCase=new MessageUseCase(
    messageRepository,
    cloudinary
)


const messageController=new MessageController(
    messageUseCase
)

const upload = multer({ storage: storage }); 

const messageRouter=express.Router()

messageRouter.get('/',ProtectRouter,(req,res,next)=>{

    messageController.searcUser(req,res,next);
})
messageRouter.post('/',ProtectRouter,(req,res,next)=>{

    messageController.accessChat(req,res,next);
})
messageRouter.get('/allChat',ProtectRouter,(req,res,next)=>{

    messageController.fetchChat(req,res,next);
})
messageRouter.post('/message',ProtectRouter,(req,res,next)=>{

    messageController.saveMessage(req,res,next);
})
messageRouter.get('/message/:ChatId',ProtectRouter,(req,res,next)=>{

    messageController.takeUserMessage(req,res,next)
})
messageRouter.post('/saveFile',upload.single('file'),ProtectRouter,(req,res,next)=>{

   messageController.saveMessageFile(req,res,next)        
})
messageRouter.get('/userNotifications',ProtectRouter,(req,res,next)=>{

    messageController.takeUserNotification(req,res,next)
})
messageRouter.get('/getChatData',ProtectRouter,(req,res,next)=>{

     messageController.takeChatData(req,res,next)
})
messageRouter.delete('/removeNotification',ProtectRouter,(req,res,next)=>{
    
    messageController.removeNotification(req,res,next)
})
messageRouter.put('/delete',ProtectRouter,(req,res,next)=>{

    messageController.deleteMessage(req,res,next);
})
messageRouter.patch('/blockChat',ProtectRouter,(req,res,next)=>{

    messageController.blockChat(req,res,next)
})




messageRouter.use(errorHandle) 

export default messageRouter;