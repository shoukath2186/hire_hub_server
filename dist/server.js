"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./frameworks/configs/app"));
const db_1 = __importDefault(require("./frameworks/configs/db"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
(0, db_1.default)();
const PORT = process.env.PORT || 3030;
const server = app_1.default.listen(PORT, () => {
    console.log(`server started running ${PORT}`);
});
const io = require('socket.io')(server, {
    pingTimereout: 6000,
    cors: {
        origin: 'http://localhost:5000'
    }
});
const onlineUsers = new Map();
io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        onlineUsers.set(userData._id, socket);
        io.emit('user online', userData._id);
        socket.emit('connected');
    });
    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    });
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    });
    socket.on('join chat', (room) => {
        socket.join(room);
    });
    socket.on('delete Messsage', (data) => {
        if (!data.users)
            return console.log('users not difained.');
        data.users.forEach((user) => {
            if (user === data._id)
                return;
            socket.in(user).emit('delete data', data);
        });
    });
    socket.on('new message', (newMessgeResiver) => {
        var chat = newMessgeResiver.chat;
        if (!chat.users)
            return console.log('chat.users not difained.');
        chat.users.forEach((user) => {
            if (user === newMessgeResiver.sender._id)
                return;
            socket.in(user).emit('message receved', newMessgeResiver);
        });
    });
    socket.on('check online status', (userId) => {
        const isOnline = onlineUsers.has(userId);
        socket.emit('online status', { userId, isOnline });
    });
    //video call manegement
    socket.on('video-call', (data) => {
        const recipientSocket = onlineUsers.get(data.to);
        // console.log('creted-call',data);
        if (recipientSocket) {
            recipientSocket.emit('video-call-signal', {
                signal: data.signal,
                chatId: data.chatId,
                from: socket.id,
                user: data.user,
                userId: data.userId
            });
        }
        else {
            console.log(`User ${data.to} is not online.`);
        }
    });
    socket.on('reject-call', (data) => {
        io.to(data.userId).emit('rejected-call-receiver');
    });
    socket.on('accept-call', (data) => {
        io.to(data.userId).emit('accept-call-recever', (data));
    });
    socket.on('returning-signal', (data) => {
        io.to(data.to).emit('incoming-signal', { signal: data.signal, from: socket.id });
    });
    socket.on('end-call', (data) => {
        io.to(data.to).emit('call-ended');
    });
    socket.on('ice-candidate', (data) => {
        const { candidate, to } = data;
        const recipientSocket = onlineUsers.get(to);
        if (recipientSocket) {
            recipientSocket.emit('ice-candidate', {
                candidate: candidate,
                from: socket.id
            });
        }
    });
    socket.on('disconnect', () => {
        for (const [userId, userSocket] of onlineUsers.entries()) {
            if (userSocket === socket) {
                onlineUsers.delete(userId);
                io.emit('user offline', userId);
                break;
            }
        }
    });
});
