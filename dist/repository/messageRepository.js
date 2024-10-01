"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../frameworks/models/userModel"));
const chatModel_1 = __importDefault(require("../frameworks/models/chatModel"));
const messageModel_1 = __importDefault(require("../frameworks/models/messageModel"));
const notificationModel_1 = __importDefault(require("../frameworks/models/notificationModel"));
class MessageRepository {
    getUser(keyWord, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = keyWord ? {
                    $or: [
                        { user_name: { $regex: keyWord, $options: 'i' } },
                        { email: { $regex: keyWord, $options: 'i' } }
                    ]
                } : {};
                const data = yield userModel_1.default.find(key).find({ _id: { $ne: user } }).select('user_name email user_role profilePicture').limit(8);
                if (data) {
                    return data;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    createNewChat(accessId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isChat = yield chatModel_1.default.find({
                    isGroupChat: false,
                    $and: [
                        { users: { $elemMatch: { $eq: user } } },
                        { users: { $elemMatch: { $eq: accessId } } }
                    ]
                }).populate("users", 'user_name email user_role profilePicture').populate('lastMessage');
                let Chat = yield userModel_1.default.populate(isChat, {
                    path: 'LastMessage.sender',
                    select: "user_name email user_role profilePicture"
                });
                if (Chat.length > 0) {
                    return Chat;
                }
                else {
                    var chatData = {
                        chatName: "cender",
                        isGroupChat: false,
                        users: [accessId, user]
                    };
                    try {
                        const createChat = yield chatModel_1.default.create(chatData);
                        const fullChat = yield chatModel_1.default.findOne({ _id: createChat._id }).populate("users", 'user_name email user_role profilePicture');
                        return [fullChat];
                    }
                    catch (error) {
                        console.log('Error in Message repository:', error);
                        return false;
                    }
                }
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    fetchChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield chatModel_1.default.find({ users: { $elemMatch: { $eq: userId } } })
                    .populate("users", 'user_name email user_role profilePicture')
                    .populate("groupAdmin", 'user_name email user_role profilePicture')
                    .populate('lastMessage')
                    .sort({ updatedAt: -1 });
                const data = yield userModel_1.default.populate(result, {
                    path: 'lastMessage.sender',
                    select: "user_name email user_role profilePicture"
                });
                return data;
            }
            catch (error) {
                console.log(12, 'Error in Message repository:', error);
                return false;
            }
        });
    }
    saveNewMessage(message, chatId, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var newMessage = {
                    sender,
                    content: message,
                    chat: chatId
                };
                var CreateNewMessage = yield messageModel_1.default.create(newMessage);
                yield chatModel_1.default.updateOne({ _id: chatId }, { $set: { lastMessage: CreateNewMessage._id } });
                CreateNewMessage = yield CreateNewMessage.populate("sender", 'user_name email user_role profilePicture');
                CreateNewMessage = yield CreateNewMessage.populate('chat');
                if (CreateNewMessage) {
                    return CreateNewMessage;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    getAllMessage(UserId, ChatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield messageModel_1.default.find({ chat: ChatId }).populate('sender', 'user_name email user_role profilePicture').populate('chat');
                if (message) {
                    return message;
                }
                return false;
            }
            catch (error) {
                console.log(123456, 'Error in Message repository:', error);
                return false;
            }
        });
    }
    saveChatFile(fileType, fileUrl, sender, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = {
                    sender,
                    content: fileUrl,
                    contentType: fileType,
                    chat: chatId
                };
                var CreateNewMessage = yield messageModel_1.default.create(newMessage);
                yield chatModel_1.default.updateOne({ _id: chatId }, { $set: { lastMessage: CreateNewMessage._id } });
                CreateNewMessage = yield CreateNewMessage.populate("sender", 'user_name email user_role profilePicture');
                CreateNewMessage = yield CreateNewMessage.populate('chat');
                if (CreateNewMessage) {
                    return CreateNewMessage;
                }
                return false;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let usersId = data.chat.users;
                const newNotification = {
                    messageId: data._id,
                    senderId: data.sender._id,
                    receiversId: usersId.filter((Id) => Id.toString() !== data.sender._id.toString()),
                    chatId: data.chat._id
                };
                yield notificationModel_1.default.create(newNotification);
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    takeNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notificationModel_1.default.find({ receiversId: { $in: [userId] } }).
                    populate({ path: 'messageId',
                    populate: [
                        { path: 'chat' },
                        { path: 'sender', select: 'user_name email user_role profilePicture' }
                    ]
                }).sort({ _id: -1 });
                if (notification) {
                    return notification;
                }
                return false;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    takeChatData(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatdata = yield chatModel_1.default.findOne({ _id: chatId }).
                    populate('lastMessage').
                    populate('users', 'user_name email user_role profilePicture');
                if (chatdata) {
                    return chatdata;
                }
                return false;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    removeUserNotification(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield notificationModel_1.default.deleteMany({ receiversId: { $in: [userId] }, chatId: chatId });
                if (data.deletedCount > 0) {
                    return 'success';
                }
                ;
                return false;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    deleteMessage(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteData = yield messageModel_1.default.deleteOne({ _id: messageId });
                if (deleteData.deletedCount > 0) {
                    const user = yield userModel_1.default.findById(userId, { user_name: 1 });
                    if (user) {
                        return user;
                    }
                }
                return false;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    blockChat(chat, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield chatModel_1.default.updateOne({ _id: chat }, [{
                        $set: {
                            Block: { $not: "$Block" },
                            blocker: { $cond: { if: "$Block", then: null, else: userId } }
                        }
                    }]);
                if (data.modifiedCount == 1) {
                    return 'Successfuly';
                }
                ;
                return false;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
    ChatIdBlocked(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield chatModel_1.default.findById(chatId);
                return data === null || data === void 0 ? void 0 : data.Block;
            }
            catch (error) {
                console.log('Error in Message repository:', error);
                return false;
            }
        });
    }
}
exports.default = MessageRepository;
