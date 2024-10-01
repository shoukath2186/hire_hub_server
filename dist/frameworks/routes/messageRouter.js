"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = __importDefault(require("../../controller/messageController"));
const messageRepository_1 = __importDefault(require("../../repository/messageRepository"));
const messageUseCase_1 = __importDefault(require("../../usecase/messageUseCase"));
const multer_1 = __importDefault(require("multer"));
const multer_2 = __importDefault(require("../middlewares/multer"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const errorHandle_1 = __importDefault(require("../middlewares/errorHandle"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const messageRepository = new messageRepository_1.default();
const cloudinary = new cloudinary_1.default();
const messageUseCase = new messageUseCase_1.default(messageRepository, cloudinary);
const messageController = new messageController_1.default(messageUseCase);
const upload = (0, multer_1.default)({ storage: multer_2.default });
const messageRouter = express_1.default.Router();
messageRouter.get('/', authMiddleware_1.default, (req, res, next) => {
    messageController.searcUser(req, res, next);
});
messageRouter.post('/', authMiddleware_1.default, (req, res, next) => {
    messageController.accessChat(req, res, next);
});
messageRouter.get('/allChat', authMiddleware_1.default, (req, res, next) => {
    messageController.fetchChat(req, res, next);
});
messageRouter.post('/message', authMiddleware_1.default, (req, res, next) => {
    messageController.saveMessage(req, res, next);
});
messageRouter.get('/message/:ChatId', authMiddleware_1.default, (req, res, next) => {
    messageController.takeUserMessage(req, res, next);
});
messageRouter.post('/saveFile', upload.single('file'), authMiddleware_1.default, (req, res, next) => {
    messageController.saveMessageFile(req, res, next);
});
messageRouter.get('/userNotifications', authMiddleware_1.default, (req, res, next) => {
    messageController.takeUserNotification(req, res, next);
});
messageRouter.get('/getChatData', authMiddleware_1.default, (req, res, next) => {
    messageController.takeChatData(req, res, next);
});
messageRouter.delete('/removeNotification', authMiddleware_1.default, (req, res, next) => {
    messageController.removeNotification(req, res, next);
});
messageRouter.put('/delete', authMiddleware_1.default, (req, res, next) => {
    messageController.deleteMessage(req, res, next);
});
messageRouter.patch('/blockChat', authMiddleware_1.default, (req, res, next) => {
    messageController.blockChat(req, res, next);
});
messageRouter.use(errorHandle_1.default);
exports.default = messageRouter;
