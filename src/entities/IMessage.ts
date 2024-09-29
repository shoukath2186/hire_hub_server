import mongoose from "mongoose";

export interface IMessage extends Document {
    sender: mongoose.Schema.Types.ObjectId;
    content: string;
    contentType:string;
    chat: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}