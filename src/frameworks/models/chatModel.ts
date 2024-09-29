import mongoose, { Schema , Model } from "mongoose";

import { IChat } from "../../entities/IChat";

const ChatSchema: Schema<IChat> = new Schema({
    chatName: {
        type: String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    Block:{
        type:Boolean,
        default:false
    },
    blocker:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},{timestamps: true});


const Chat: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
