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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserController {
    constructor(userUsecase) {
        this._userUsecase = userUsecase;
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this._userUsecase.checkExist(req.body.email);
                if (verifyUser.status === 200) {
                    const user = yield this._userUsecase.signup(req.body.userName, req.body.lastName, req.body.phone, req.body.email, req.body.password, req.body.userRole);
                    //console.log(23456,user); 
                    if (user._id) {
                        this._userUsecase.deleteOtpData(user._id);
                    }
                    return res.status(user.status).json({ response: { message: user.message, data: user.data } });
                }
                else {
                    return res.status(verifyUser.status).json(verifyUser.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    verification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userUsecase.verify_otp(req.body.otp, req.body.email);
                if (response.message == 'varification succussfull.') {
                    const userDate = yield this._userUsecase.fetchUserByEmail(req.body.email);
                    if (userDate.message == 'User does not exist.') {
                        return res.status(response.status).json(response.message);
                    }
                    const User = userDate.data;
                    const createToken = yield this._userUsecase.createToken(User);
                    res.cookie('refreshToken', createToken.refreshToken, {
                        httpOnly: true,
                        maxAge: 10 * 24 * 60 * 60 * 1000,
                        secure: true,
                        sameSite: 'none',
                    });
                    res.cookie('accessToken', createToken.accessToken, {
                        httpOnly: true,
                        maxAge: 1 * 60 * 60 * 1000,
                        secure: true,
                        sameSite: 'none',
                    });
                    return res.status(200).json(User);
                }
                return res.status(response.status).json(response.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userUsecase.createNewOtp(req.body.email);
                // console.log(response);
                if (response._id) {
                    this._userUsecase.deleteOtpData(response._id);
                }
                return res.status(response.status).json(response.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(1234,req.body); 
                const RequestData = req.body;
                const response = yield this._userUsecase.verify_login(RequestData);
                if (response.status && response.status == 400) {
                    return res.status(response.status).json(response.message);
                }
                if (response.data) {
                    const User = response.data;
                    const createToken = yield this._userUsecase.createToken(User);
                    const UserData = {
                        _id: User._id,
                        user_name: User.user_name,
                        last_name: User.last_name,
                        phone: User.phone,
                        email: User.email,
                        user_role: User.user_role,
                        profilePicture: User.profilePicture
                    };
                    const { refreshToken, accessToken } = createToken;
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        maxAge: 10 * 24 * 60 * 60 * 1000,
                        secure: true,
                        sameSite: 'none',
                    });
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        maxAge: 1 * 60 * 60 * 1000,
                        secure: true,
                        sameSite: 'none',
                    });
                    //  console.log(978654,createToken);
                    return res.status(200).json(UserData);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const forgotPassword = yield this._userUsecase.forgotPassword(req.body.email);
                if (forgotPassword.status == 400) {
                    return res.status(forgotPassword.status).json(forgotPassword.message);
                }
                return res.status(forgotPassword.status).json(forgotPassword.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reset = yield this._userUsecase.reset_Password(req.body.password, req.body.userId);
                res.status(reset.status).json(reset.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this._userUsecase.logout(req.body.userId);
                if (responseData.status == 400) {
                    return res.status(responseData.status).json(responseData.message);
                }
                res.clearCookie('refreshToken');
                res.clearCookie('accessToken');
                res.status(200).json(responseData.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this._userUsecase.checkExist(req.body.email);
                if (verifyUser.status == 400) {
                    const user = yield this._userUsecase.signInGoogle(req.body.email);
                    if (user.status == 400) {
                        return res.status(user.status).json(user.message);
                    }
                    const User = user;
                    const createToken = yield this._userUsecase.createToken(User);
                    const UserData = {
                        _id: User._id,
                        user_name: User.user_name,
                        last_name: User.last_name,
                        phone: User.phone,
                        email: User.email,
                        user_role: User.user_role,
                        profilePicture: User.profilePicture
                    };
                    const { refreshToken, accessToken } = createToken;
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        maxAge: 10 * 24 * 60 * 60 * 1000,
                        secure: true,
                        sameSite: 'none',
                    });
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        maxAge: 1 * 60 * 60 * 1000,
                        secure: true,
                        sameSite: 'none',
                    });
                    return res.status(200).json(UserData);
                }
                else {
                    const user = yield this._userUsecase.signupGoogle(req.body);
                    if (user.status == 200) {
                        const User = user.data;
                        const createToken = yield this._userUsecase.createToken(User);
                        const UserData = {
                            _id: User._id,
                            user_name: User.user_name,
                            last_name: User.last_name,
                            phone: User.phone,
                            email: User.email,
                            user_role: User.user_role,
                            profilePicture: User.profilePicture
                        };
                        const { refreshToken, accessToken } = createToken;
                        res.cookie('refreshToken', refreshToken, { httpOnly: true });
                        res.cookie('accessToken', accessToken, { httpOnly: true });
                        return res.status(200).json(UserData);
                    }
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
