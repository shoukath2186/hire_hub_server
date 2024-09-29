

import mongoose, { Schema, Document, Model } from "mongoose";

import { IMessage } from "../../entities/IMessage";


const MessageSchema: Schema<IMessage> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    contentType:{
        type:String,
        default:'text'
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true 
    }
}, {
    timestamps: true
});


const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
