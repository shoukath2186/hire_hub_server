
import Cloudinary from "../frameworks/utils/cloudinary";
import MessageRepository from "../repository/messageRepository"
import { ObjectId } from "mongoose";
import fs from 'fs';

class MessageUseCase{

    private _messageRepo:MessageRepository
    private _clodinary:Cloudinary

    constructor(
        messageRepository:MessageRepository,
        cloudinary:Cloudinary
    ){
        this._messageRepo=messageRepository,
        this._clodinary=cloudinary
    }

    async getSearchData(keyWord:string,user:string|ObjectId){
        try {

            const data=await this._messageRepo.getUser(keyWord,user);
            if(data){
                return{
                    status:200,
                    data:data
                }
            }
            return{
                status:400,
                message:'Users not found.'
            }
            
        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }

    }   
    async createChat(accessId:string,user:string|ObjectId){
        try {
            const Chat=await this._messageRepo.createNewChat(accessId,user);
            if(Chat){
                return{
                    status:200,
                    data:Chat
                }
            }
            return{
                status:400,
                message:'Users not found.'
            }

        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }
    }
    async FetchChat(userId:string|ObjectId){
        try {
            const data=await this._messageRepo.fetchChat(userId);

            if(data){
                return{
                    status:200,
                    data:data
                }
            }
            return{
                status:400,
                message:'Chat not found.'
            }
        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }
    }
    async saveMessage(message:any,chatId:any,sender:string|ObjectId){ 
        try {
            
            const checkChatIsBlockd=await this._messageRepo.ChatIdBlocked(chatId);
            if(checkChatIsBlockd){
                return {
                    status: 401,
                    message: "Chat is blocked.",
                  };
                
            }
            
            const data=await this._messageRepo.saveNewMessage(message,chatId,sender);
              
            if(data){
                await this._messageRepo.createNotification(data);
                return{
                    status:200,
                    data:data 
                }
            }
            return{
                status:400,
                message:'Message creation faild.'
            }
            
        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }
    }
    async getUserMessage(userId:string|ObjectId,chatId:any){
        try {

            const data=await this._messageRepo.getAllMessage(userId,chatId);
            if(data){
                return{
                    status:200,
                    data:data
                }
            }
            return{
                status:400,
                message:'Message creation faild.'
            }

        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }
    }
    async saveMessageFile(file:any,user:string|ObjectId,chatId:string){ 
        try {
            const checkChatIsBlockd=await this._messageRepo.ChatIdBlocked(chatId);
            if(checkChatIsBlockd){
                fs.unlinkSync(file.path);
                return {
                    status: 401,
                    message: "Chat is blocked.",
                  };
                
            }
        const mimeType = file.mimetype;
        let fileType='' 
        let fileUrl='' 
        if (mimeType.startsWith('audio/')) {
             fileUrl =await this._clodinary.saveAudioFile(file);
            fileType='audio'
        } else if (mimeType.startsWith('video/')) {
             fileUrl =await this._clodinary.saveVideoFile(file);
             fileType='video'
        } else if (mimeType.startsWith('image/')) {
            fileUrl =await this._clodinary.saveImageFile(file);
           fileType='image'
        } else {
            return {
                status: 415,
                message: "Unsupported file type",
            };
        }
   
        const data=await this._messageRepo.saveChatFile(fileType,fileUrl,user,chatId);
        if(data){
            await this._messageRepo.createNotification(data);
            return{
                status:200,
                data:data
            }
        }
        return{
            status:400,
            message:'Message creation faild.'
        }

            
            
        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }

    }
    async takeNotification(userId:string|ObjectId){
        try {
            const data=await this._messageRepo.takeNotification(userId);
            if(data){
                return{
                    status:200,
                    data:data
                }
            }
            return{
                status:400,
                message:'Message creation faild.'
            }
            
        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }
    }
    async getChatData(chatId:string){
        try {
            const data=await this._messageRepo.takeChatData(chatId);
            if(data){
                return{
                    status:200,
                    data:data
                }
            }
            return{
                status:400,
                message:'Message creation faild.'
            }
        } catch (error) {
            return {
                status: 404,
                message: "An error occurred in MessageUseCase",
              };
        }
    }
  async deteteChat(chatId:string,userId:string|ObjectId){ 
     try {
        const data= await this._messageRepo.removeUserNotification(chatId,userId)
        if(data){
            return{
                status:200,
                data:data
            }
        }
        return{
            status:400,
            message:'No notifcation data.'
        }
     } catch (error) {
        return {
            status: 404,
            message: "An error occurred in MessageUseCase",
          };
     }
  }
  async removeMessage(messagedata:any,userId:string|ObjectId){
       try {
          if(messagedata.contentType=='audio'||messagedata.contentType=='video'||messagedata.contentType=='image'){
             this._clodinary.removeS3File(messagedata.content)
          }
          
          const data=await this._messageRepo.deleteMessage(messagedata._id,userId);
          if(data){
            return{
                status:200,
                data:data
            }
        }
        return{
            status:400,
            message:'delet message faild.'
        }
       } catch (error) {
        return {
            status: 404,
            message: "An error occurred in MessageUseCase",
          };
       }
  }
  async blockChat(chatId:string,userId:string|ObjectId){
     try {
        const data=await this._messageRepo.blockChat(chatId,userId);
      
          if(data){
            return{
                status:200,
                data:data
            }
        }
        return{
            status:400,
            message:'failed'
        }
     } catch (error) {
        return {
            status: 404,
            message: "An error occurred in MessageUseCase",
          };
     }
  }

}

export default MessageUseCase 