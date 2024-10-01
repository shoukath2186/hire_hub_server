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
const fs_1 = __importDefault(require("fs"));
class MessageUseCase {
    constructor(messageRepository, cloudinary) {
        this._messageRepo = messageRepository,
            this._clodinary = cloudinary;
    }
    getSearchData(keyWord, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.getUser(keyWord, user);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Users not found.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    createChat(accessId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Chat = yield this._messageRepo.createNewChat(accessId, user);
                if (Chat) {
                    return {
                        status: 200,
                        data: Chat
                    };
                }
                return {
                    status: 400,
                    message: 'Users not found.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    FetchChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.fetchChat(userId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Chat not found.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    saveMessage(message, chatId, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkChatIsBlockd = yield this._messageRepo.ChatIdBlocked(chatId);
                if (checkChatIsBlockd) {
                    return {
                        status: 401,
                        message: "Chat is blocked.",
                    };
                }
                const data = yield this._messageRepo.saveNewMessage(message, chatId, sender);
                if (data) {
                    yield this._messageRepo.createNotification(data);
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Message creation faild.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    getUserMessage(userId, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.getAllMessage(userId, chatId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Message creation faild.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    saveMessageFile(file, user, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkChatIsBlockd = yield this._messageRepo.ChatIdBlocked(chatId);
                if (checkChatIsBlockd) {
                    fs_1.default.unlinkSync(file.path);
                    return {
                        status: 401,
                        message: "Chat is blocked.",
                    };
                }
                const mimeType = file.mimetype;
                let fileType = '';
                let fileUrl = '';
                if (mimeType.startsWith('audio/')) {
                    fileUrl = yield this._clodinary.saveAudioFile(file);
                    fileType = 'audio';
                }
                else if (mimeType.startsWith('video/')) {
                    fileUrl = yield this._clodinary.saveVideoFile(file);
                    fileType = 'video';
                }
                else if (mimeType.startsWith('image/')) {
                    fileUrl = yield this._clodinary.saveImageFile(file);
                    fileType = 'image';
                }
                else {
                    return {
                        status: 415,
                        message: "Unsupported file type",
                    };
                }
                const data = yield this._messageRepo.saveChatFile(fileType, fileUrl, user, chatId);
                if (data) {
                    yield this._messageRepo.createNotification(data);
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Message creation faild.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    takeNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.takeNotification(userId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Message creation faild.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    getChatData(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.takeChatData(chatId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'Message creation faild.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    deteteChat(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.removeUserNotification(chatId, userId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'No notifcation data.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    removeMessage(messagedata, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (messagedata.contentType == 'audio' || messagedata.contentType == 'video' || messagedata.contentType == 'image') {
                    this._clodinary.removeS3File(messagedata.content);
                }
                const data = yield this._messageRepo.deleteMessage(messagedata._id, userId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'delet message faild.'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
    blockChat(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._messageRepo.blockChat(chatId, userId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'failed'
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred in MessageUseCase",
                };
            }
        });
    }
}
exports.default = MessageUseCase;
