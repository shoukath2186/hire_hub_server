"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandle_1 = __importDefault(require("../middlewares/errorHandle"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const multer_1 = __importDefault(require("multer"));
const profileCnotroller_1 = __importDefault(require("../../controller/profileCnotroller"));
const profileRepository_1 = __importDefault(require("../../repository/profileRepository"));
const profileUseCase_1 = __importDefault(require("../../usecase/profileUseCase"));
const multer_2 = __importDefault(require("../middlewares/multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const upload = (0, multer_1.default)({ storage: multer_2.default });
const profileRepository = new profileRepository_1.default();
const cloudinary = new cloudinary_1.default();
const ecryptPassword = new bcryptPassword_1.default();
const profileUseCase = new profileUseCase_1.default(profileRepository, cloudinary, ecryptPassword);
const profileCnotroller = new profileCnotroller_1.default(profileUseCase);
const profileRouter = express_1.default.Router();
profileRouter.post('/createProfile', authMiddleware_1.default, (req, res, next) => {
    profileCnotroller.createJobProfile(req, res, next);
});
profileRouter.get('/userJobProfile', authMiddleware_1.default, (req, res, next) => {
    profileCnotroller.getProfileData(req, res, next);
});
profileRouter.put('/updateJobProfile', authMiddleware_1.default, upload.single('resume'), (req, res, next) => {
    profileCnotroller.updateJobProfile(req, res, next);
});
profileRouter.patch('/updateMain', authMiddleware_1.default, upload.single('profilePicture'), (req, res, next) => {
    profileCnotroller.updateMainProfile(req, res, next);
});
profileRouter.get('/seekerpAplications', authMiddleware_1.default, (req, res, next) => {
    profileCnotroller.seekerAplication(req, res, next);
});
profileRouter.get('/getApplicationJob', authMiddleware_1.default, (req, res, next) => {
    profileCnotroller.getJobData(req, res, next);
});
profileRouter.use(errorHandle_1.default);
exports.default = profileRouter;
