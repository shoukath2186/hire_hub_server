
import { ObjectId } from "mongoose";
import MessageUseCase from "../usecase/messageUseCase";
import {Request,Response,NextFunction} from "express";

interface CustomRequest extends Request {
    user?: string | ObjectId;
    file?:any
    query: {
        search?: string;
        [key: string]: any;
    };
}

class MessageController{ 

    private _messageUseCase:MessageUseCase
    constructor(messageUseCase:MessageUseCase){
       this._messageUseCase=messageUseCase
    }

    async searcUser(req:CustomRequest,res:Response,next:NextFunction){
        try {
          
          if(req.user&&req.query.search){

            const keyWord=req.query.search

            const response=await this._messageUseCase.getSearchData(keyWord,req.user);
            if(response.status==200){
                res.status(200).json(response.data)
            }else{
                res.status(response.status).json(response.message);
            }

          }else{
            res.status(401).json('Authentication failed. Please log in to continue.');
          }   
        } catch (error) {
            next(error)
        }
    }
    async accessChat(req:CustomRequest,res:Response,next:NextFunction){
        try {
            const accessUserId=req.body.userId
            if(accessUserId&&req.user){
                
                
                const response=await this._messageUseCase.createChat(accessUserId,req.user)
                if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(response.status).json(response.message);
                }

            }else{
                res.status(401).json('User not defianed.');
            }
        } catch (error) {
            next(error)
        }
    }
    async fetchChat(req:CustomRequest,res:Response,next:NextFunction){
        try {
            if(req.user){
                const response=await this._messageUseCase.FetchChat(req.user);
                if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(response.status).json(response.message);
                }
            }else{
                
            }
        } catch (error) {
            next(error)
        }
    }
    async saveMessage(req:CustomRequest,res:Response,next:NextFunction){ 
        try {
            if(req.body.value&&req.body.chatId&&req.user){
            const saveMessage=await this._messageUseCase.saveMessage(req.body.value,req.body.chatId,req.user);
            if(saveMessage.status==200){
                res.status(200).json(saveMessage.data)
            }else{
                res.status(saveMessage.status).json(saveMessage.message);
            }
            }else{
                res.status(401).json("invalid data passed in request");
            }
            
        } catch (error) {
            next(error)
        }
    }
    async takeUserMessage(req:CustomRequest,res:Response,next:NextFunction){
        try {
            if(req.user&&req.params.ChatId){
                const response=await this._messageUseCase.getUserMessage(req.user,req.params.ChatId);
                if(response.status==200){
                 res.status(200).json(response.data)
             }else{
                 res.status(response.status).json(response.message);
             }
             }else{
                 res.status(401).json("invalid data passed in request");
             }
        } catch (error) {
            next(error)
        }
       
    }
    async saveMessageFile(req:CustomRequest,res:Response,next:NextFunction){ 
        try {

            if(req.file&&req.user&&req.body.chatId){
                const response=await this._messageUseCase.saveMessageFile(req.file,req.user,req.body.chatId);
                if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(response.status).json(response.message);
                }

            }else{
                res.status(401).json("invalid data passed in request");
            }

        } catch (error) {
            next(error)
        }
    }
    async takeUserNotification(req:CustomRequest,res:Response,next:NextFunction){
        try {
            if(req.user){
                
                const response=await this._messageUseCase.takeNotification(req.user);
                if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(response.status).json(response.message);
                }
            }else{
                res.status(401).json('User not defianed.');
            }
        } catch (error) {
            next(error)
        }
    }
    async takeChatData(req:CustomRequest,res:Response,next:NextFunction){
        try {
           if(req.query.chatId){
              const response=await this._messageUseCase.getChatData(req.query.chatId);
              if(response.status==200){
                res.status(200).json(response.data)
            }else{
                res.status(response.status).json(response.message);
            }
              
           }else{
            res.status(401).json("invalid data passed in request");
           };
            
        } catch (error) {
            next(error)
        }
    }
    async removeNotification(req:CustomRequest,res:Response,next:NextFunction){
        try {
            if(req.query.chatId&&req.user){
                  const response= await this._messageUseCase.deteteChat(req.query.chatId,req.user);
                  if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(200).json(response.message);
                }
            }else{
                res.status(401).json('User not defianed. or invalid data passed in request');
            };
            
        } catch (error) {
            next(error)
        }
    }

    async deleteMessage(req:CustomRequest,res:Response,next:NextFunction){
        try {
          
            if(req.user){
               const response=await this._messageUseCase.removeMessage(req.body,req.user);
               if(response.status==200){
                res.status(200).json(response.data)
            }else{
                res.status(response.status).json(response.message);
            }
            }else{
                res.status(401).json("User not defianed.");
            };
            
        } catch (error) {
            next(error)
        }
    }
    async blockChat(req:CustomRequest,res:Response,next:NextFunction){
        try {
            if(req.query.chatId&&req.user){
                const response=await this._messageUseCase.blockChat(req.query.chatId,req.user);
                if(response.status==200){
                    res.status(200).json(response.data)
                }else{
                    res.status(response.status).json(response.message);
                }
            }else{
                res.status(401).json("invalid data passed in request"); 
            }
        } catch (error) {
            next(error)
        }
    }
    

}

export default MessageController;