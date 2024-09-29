
import app from './frameworks/configs/app'
import connectDB from "./frameworks/configs/db";
import * as dotenv from 'dotenv';
import { Server, Socket } from "socket.io";
import { SocketUser } from './usecase/interfaces/ISocket/ISoketUser';


dotenv.config();
connectDB();


const PORT = process.env.PORT || 3030;

const server = app.listen(PORT, () => {

  console.log(`server started running ${PORT}`);

});

const io = require('socket.io')(server, {
  pingTimereout: 6000,
  cors: {
    origin: 'http://localhost:5000'
  }
})

const onlineUsers: Map<string, Socket> = new Map();

io.on('connection', (socket: Socket) => {

  socket.on('setup', (userData: SocketUser) => {


    socket.join(userData._id);
    onlineUsers.set(userData._id, socket);
    io.emit('user online', userData._id);
    socket.emit('connected');


  })

  socket.on('typing', (room: string) => {
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room: string) => {
    socket.in(room).emit('stop typing');
  });


  socket.on('join chat', (room: string) => {

    socket.join(room);
 
  })
  socket.on('delete Messsage', (data: any) => {
    if (!data.users) return console.log('users not difained.');

    data.users.forEach((user: string) => {
      if (user === data._id) return
      socket.in(user).emit('delete data', data)
    })

  })
  socket.on('new message', (newMessgeResiver: any) => {
    var chat = newMessgeResiver.chat;

    if (!chat.users) return console.log('chat.users not difained.');
    chat.users.forEach((user: string) => {
      if (user === newMessgeResiver.sender._id) return
      socket.in(user).emit('message receved', newMessgeResiver);
    })
  })

  socket.on('check online status', (userId: string) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit('online status', { userId, isOnline })
  })


  //video call manegement
  socket.on('video-call', (data: { signal: any, chatId: string, to: string, user: string, userId: string }) => {
   
    const recipientSocket=onlineUsers.get(data.to)
    // console.log('creted-call',data);
    
    if(recipientSocket){
      recipientSocket.emit('video-call-signal', { 
        signal: data.signal, 
        chatId: data.chatId,  
        from: socket.id,     
        user: data.user,       
        userId: data.userId   
    });
    }else{
      console.log(`User ${data.to} is not online.`);
    }
    
  })

  socket.on('reject-call',(data:any)=>{
    io.to(data.userId).emit('rejected-call-receiver');
    
  })
  socket.on('accept-call',(data:{ rejecter: string, from:string, signal:any, user:string,userId:string })=>{
   
    io.to(data.userId).emit('accept-call-recever',(data));
  })
  socket.on('returning-signal',(data:{signal: any, to: string})=>{

    io.to(data.to).emit('incoming-signal',{signal:data.signal,from:socket.id})
  })


  socket.on('end-call',(data:any)=>{
     io.to(data.to).emit('call-ended') 
  })
  socket.on('ice-candidate',(data:any)=>{
    const {candidate,to}=data;
    const recipientSocket = onlineUsers.get(to);
    if(recipientSocket){
      recipientSocket.emit('ice-candidate',{
        candidate:candidate,
        from:socket.id
      })
    }
    
  })
  

  socket.on('disconnect', () => { 
    for (const [userId, userSocket] of onlineUsers.entries()) {
      if (userSocket === socket) {
        onlineUsers.delete(userId)
        io.emit('user offline', userId);
        break;
      }
    }




  });
})