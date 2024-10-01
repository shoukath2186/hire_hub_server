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
Object.defineProperty(exports, "__esModule", { value: true });
class MessageController {
    constructor(messageUseCase) {
        this._messageUseCase = messageUseCase;
    }
    searcUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user && req.query.search) {
                    const keyWord = req.query.search;
                    const response = yield this._messageUseCase.getSearchData(keyWord, req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json('Authentication failed. Please log in to continue.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    accessChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessUserId = req.body.userId;
                if (accessUserId && req.user) {
                    const response = yield this._messageUseCase.createChat(accessUserId, req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json('User not defianed.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log();
                if (req.user) {
                    const response = yield this._messageUseCase.FetchChat(req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    saveMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.value && req.body.chatId && req.user) {
                    const saveMessage = yield this._messageUseCase.saveMessage(req.body.value, req.body.chatId, req.user);
                    if (saveMessage.status == 200) {
                        res.status(200).json(saveMessage.data);
                    }
                    else {
                        res.status(saveMessage.status).json(saveMessage.message);
                    }
                }
                else {
                    res.status(401).json("invalid data passed in request");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    takeUserMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user && req.params.ChatId) {
                    const response = yield this._messageUseCase.getUserMessage(req.user, req.params.ChatId);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json("invalid data passed in request");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    saveMessageFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file && req.user && req.body.chatId) {
                    const response = yield this._messageUseCase.saveMessageFile(req.file, req.user, req.body.chatId);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json("invalid data passed in request");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    takeUserNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const response = yield this._messageUseCase.takeNotification(req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json('User not defianed.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    takeChatData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.chatId) {
                    const response = yield this._messageUseCase.getChatData(req.query.chatId);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json("invalid data passed in request");
                }
                ;
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.chatId && req.user) {
                    const response = yield this._messageUseCase.deteteChat(req.query.chatId, req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(200).json(response.message);
                    }
                }
                else {
                    res.status(401).json('User not defianed. or invalid data passed in request');
                }
                ;
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const response = yield this._messageUseCase.removeMessage(req.body, req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json("User not defianed.");
                }
                ;
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.chatId && req.user) {
                    const response = yield this._messageUseCase.blockChat(req.query.chatId, req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json("invalid data passed in request");
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = MessageController;
