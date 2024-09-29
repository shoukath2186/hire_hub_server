import mongoose from "mongoose";

export interface IChat extends Document {
    chatName: string;
    isGroupChat: boolean;
    Block:boolean;
    blocker:mongoose.Schema.Types.ObjectId;
    users: mongoose.Schema.Types.ObjectId[];
    lastMessage?: mongoose.Schema.Types.ObjectId;
    groupAdmin?: mongoose.Schema.Types.ObjectId;
}


