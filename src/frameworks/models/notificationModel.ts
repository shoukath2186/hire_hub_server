
import mongoose, { Schema, Document, Model } from 'mongoose';


interface INotification extends Document {
   messageId: mongoose.Schema.Types.ObjectId;
   senderId:mongoose.Schema.Types.ObjectId;
   receiversId: mongoose.Schema.Types.ObjectId[];
   chatId: mongoose.Schema.Types.ObjectId;
   createdAt?: Date;
   updatedAt?: Date;
}


const NotificationSchema: Schema = new Schema(
   {
      messageId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Message',
         required: true,
      },
      chatId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Chat',
         required: true
      },
      senderId:{
         type: mongoose.Schema.Types.ObjectId,
         ref:'users',
         require:true
      },
      receiversId: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
         required: true,
      }],
   },
   { timestamps: true }
);


const Notification: Model<INotification> = mongoose.model<INotification>(
   'Notification',
   NotificationSchema
);

export default Notification;
