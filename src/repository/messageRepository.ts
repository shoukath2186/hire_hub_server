
import UserModel from "../frameworks/models/userModel";
import { ObjectId } from "mongoose";
import Chats from '../frameworks/models/chatModel'
import Message from "../frameworks/models/messageModel";
import NotificationModel from "../frameworks/models/notificationModel";

class MessageRepository {

    async getUser(keyWord: string, user: string | ObjectId) {
        try {
            const key = keyWord ? {
                $or: [
                    { user_name: { $regex: keyWord, $options: 'i' } },
                    { email: { $regex: keyWord, $options: 'i' } }

                ]
            } : {};

            const data = await UserModel.find(key).find({ _id: { $ne: user } }).select('user_name email user_role profilePicture').limit(8)

            if (data) {
                return data
            } else {
                return false
            }


        } catch (error) {
            console.log('Error in Message repository:', error);
            return false
        }
    }
    async createNewChat(accessId: string, user: string | ObjectId) {
        try {
            let isChat = await Chats.find({
                isGroupChat: false,
                $and: [
                    { users: { $elemMatch: { $eq: user } } },
                    { users: { $elemMatch: { $eq: accessId } } }
                ]
            }).populate("users", 'user_name email user_role profilePicture').populate('lastMessage');

            let Chat = await UserModel.populate(isChat, {
                path: 'LastMessage.sender',
                select: "user_name email user_role profilePicture"
            })

            if (Chat.length > 0) {

                return Chat

            } else {
                var chatData = {
                    chatName: "cender",
                    isGroupChat: false,
                    users: [accessId, user]
                }
                try {
                    const createChat = await Chats.create(chatData);

                    const fullChat = await Chats.findOne({ _id: createChat._id }).populate(
                        "users", 'user_name email user_role profilePicture'
                    );
                    return [fullChat]

                } catch (error) {
                    console.log('Error in Message repository:', error);
                    return false

                }
            }


        } catch (error) {
            console.log('Error in Message repository:', error);
            return false
        }
    }
    async fetchChat(userId: string | ObjectId) {

        try {

            const result = await Chats.find({ users: { $elemMatch: { $eq: userId } } })
                .populate("users", 'user_name email user_role profilePicture')
                .populate("groupAdmin", 'user_name email user_role profilePicture')
                .populate('lastMessage')
                .sort({ updatedAt: -1 })

            const data = await UserModel.populate(result, {
                path: 'lastMessage.sender',
                select: "user_name email user_role profilePicture"
            })
            
                return data


        } catch (error) {
            console.log(12,'Error in Message repository:', error);
            return false
        }
    }
    async saveNewMessage(message:any,chatId:any,sender:string|ObjectId){ 
        try {
            var newMessage={
                sender,
                content:message,
                chat:chatId
            }

            var CreateNewMessage=await Message.create(newMessage);
            await Chats.updateOne({_id:chatId},{$set:{lastMessage:CreateNewMessage._id}});

            CreateNewMessage=await CreateNewMessage.populate("sender", 'user_name email user_role profilePicture');
            CreateNewMessage=await CreateNewMessage.populate('chat');
            

            

            
           if(CreateNewMessage){
             return CreateNewMessage
           }else{
            return false
           }
            
        } catch (error) {
            console.log('Error in Message repository:', error);
            return false
        }
    }

    async getAllMessage(UserId:string|ObjectId,ChatId:any){ 
          try {

            const message=await Message.find({chat:ChatId}).populate('sender','user_name email user_role profilePicture').populate('chat');
             
            if(message){

               
               
               
                return message
            }
            return false

          } catch (error) {
            console.log(123456,'Error in Message repository:', error); 
            return false
          }
    }
    async saveChatFile(fileType:string,fileUrl:string,sender:string|ObjectId,chatId:string){
        try {
            const newMessage={
                sender,
                content:fileUrl,
                contentType:fileType,
                chat:chatId
            }
            var CreateNewMessage=await Message.create(newMessage);
            await Chats.updateOne({_id:chatId},{$set:{lastMessage:CreateNewMessage._id}})

            CreateNewMessage=await CreateNewMessage.populate("sender", 'user_name email user_role profilePicture');
            CreateNewMessage=await CreateNewMessage.populate('chat');

            

           if(CreateNewMessage){
            return CreateNewMessage
           }
           return false   
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    }
    async createNotification(data:any){
        try {
            let usersId=data.chat.users
            const newNotification={
                messageId: data._id,
                senderId:data.sender._id,
                receiversId:usersId.filter((Id:string)=>Id.toString()!==data.sender._id.toString()),
                chatId:data.chat._id
            }
          await NotificationModel.create(newNotification)

          
            
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    } 
    async takeNotification(userId:string|ObjectId){
        try {
            
            const notification=await NotificationModel.find({receiversId:{$in:[userId]}}).
            populate({path:'messageId',
                populate:[
                    {path:'chat'},
                    {path:'sender',select:'user_name email user_role profilePicture'}
                ]
            }).sort({_id:-1})

            if(notification){
                return notification

            }
            return false
           
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    }
    async takeChatData(chatId:string){
        try {
            const chatdata=await Chats.findOne({_id:chatId}).
            populate('lastMessage').
            populate('users','user_name email user_role profilePicture')
            if(chatdata){
                return chatdata
            }
            return false
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    }
    async removeUserNotification(chatId:string,userId:string|ObjectId){
        try {
            const data= await NotificationModel.deleteMany({receiversId:{$in:[userId]},chatId:chatId});

            if(data.deletedCount>0){
                return 'success'
            };

            return false
            
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    }
    async deleteMessage(messageId:string,userId:string|ObjectId){
         try {
            const deleteData=await Message.deleteOne({_id:messageId})
           if(deleteData.deletedCount>0){
              const user=await UserModel.findById(userId,{user_name:1})
              if(user){
                 return user
              }  
           }
           return false
            
         } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
         }
    }
    async blockChat(chat:string,userId:string|ObjectId){
        try {
            const data=await Chats.updateOne({_id:chat},[{
                $set: {
                  Block: { $not: "$Block" }, 
                  blocker: { $cond: { if: "$Block", then: null, else: userId } }
                }
              }])
            if(data.modifiedCount==1){
                return 'Successfuly';
                
            };
            return false 
            
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    }
    async ChatIdBlocked(chatId:any){
        try { 
            const data=await Chats.findById(chatId);
            
                return data?.Block
            
            
        } catch (error) {
            console.log('Error in Message repository:', error); 
            return false
        }
    }

}

export default MessageRepository; 