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
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../../controller/userController"));
const userUseCases_1 = __importDefault(require("../../usecase/userUseCases"));
const userRepository_1 = __importDefault(require("../../repository/userRepository"));
const generateOtp_1 = __importDefault(require("../utils/generateOtp"));
const bcryptOtp_1 = __importDefault(require("../utils/bcryptOtp"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const sentMail_1 = __importDefault(require("../utils/sentMail"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const errorHandle_1 = __importDefault(require("../middlewares/errorHandle"));
const stringGenerator_1 = __importDefault(require("../utils/stringGenerator"));
const ForgotPasswordLinkSent_1 = __importDefault(require("../utils/ForgotPasswordLinkSent"));
const userRouter = express_1.default.Router();
//services
const generateOtp = new generateOtp_1.default();
const ecryptPassword = new bcryptPassword_1.default();
const encryptOtp = new bcryptOtp_1.default();
const generateMail = new sentMail_1.default();
const jwtToken = new generateToken_1.default();
const stringGenerator = new stringGenerator_1.default();
const forgotPasswordLink = new ForgotPasswordLinkSent_1.default();
//repositories
const userRepository = new userRepository_1.default();
//useCases
const userCase = new userUseCases_1.default(userRepository, generateOtp, ecryptPassword, encryptOtp, generateMail, jwtToken, stringGenerator, forgotPasswordLink);
//controllers
const userController = new userController_1.default(userCase);
userRouter.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield setTimeout(() => {
        userController.signUp(req, res, next);
    }, 2000);
}));
userRouter.post("/verify-otp", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.verification(req, res, next);
}));
userRouter.post("/resendOtp", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.resendOtp(req, res, next);
}));
userRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.login(req, res, next);
}));
userRouter.post('/forgotPassword', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.forgotPassword(req, res, next);
}));
userRouter.post('/reset-password', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.resetPassword(req, res, next);
}));
userRouter.post('/logout', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.logout(req, res, next);
}));
userRouter.post('/loginGoogle', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    userController.googleLogin(req, res, next);
}));
userRouter.use(errorHandle_1.default);
exports.default = userRouter;
