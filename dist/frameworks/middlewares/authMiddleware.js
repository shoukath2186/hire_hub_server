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
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const userRepository_1 = __importDefault(require("../../repository/userRepository"));
const userRepository = new userRepository_1.default();
const jwtToken = new generateToken_1.default();
function createAccessToken(decoded, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (decoded) {
            const user = yield userRepository.FindbyIdforAccessToken(decoded._id);
            if (user) {
                const newAccessToken = jwtToken.accessToken(user);
                // console.log(1212,newAccessToken);
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    maxAge: 1 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'strict',
                });
                req.user = user._id;
                next();
            }
            else {
                res.status(414).json('user not found');
            }
        }
        else {
            res.status(414).json('Invalid token');
        }
    });
}
function ProtectRouter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = req.cookies.accessToken;
        let refreshToken = req.cookies.refreshToken;
        const accessSecret = process.env.JWT_ACCESS_KEY;
        const refreshSecret = process.env.JWT_REFRESH_KEY;
        if (!refreshToken) {
            res.clearCookie('accessToken');
            res.status(414).json('No User token');
            return;
        }
        if (accessToken) {
            if (accessSecret) {
                try {
                    const data = jsonwebtoken_1.default.verify(accessToken, accessSecret);
                    let id = data._id;
                    const block = yield userRepository.checkUserBlock(id);
                    if (block) {
                        res.status(414).json('User is Blocked.');
                    }
                    else {
                        req.user = id;
                        next();
                    }
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                        // console.error('Access token has expired:', error.message);
                        if (refreshToken && refreshSecret) {
                            try {
                                const data = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
                                let id = data._id;
                                const block = yield userRepository.checkUserBlock(id);
                                if (block) {
                                    res.status(414).json('User is Blocked.');
                                }
                                else {
                                    req.user = id;
                                    yield createAccessToken(data, req, res, next);
                                }
                            }
                            catch (error) {
                                res.clearCookie('accessToken');
                                res.status(414).json('User Unauthorized');
                            }
                        }
                        else {
                            res.clearCookie('accessToken');
                            res.status(414).json('User Unauthorized');
                        }
                    }
                }
            }
        }
        else {
            if (refreshToken && refreshSecret) {
                try {
                    const data = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
                    let id = data._id;
                    const block = yield userRepository.checkUserBlock(id);
                    if (block) {
                        res.status(414).json('User is Blocked.');
                    }
                    else {
                        req.user = id;
                        yield createAccessToken(data, req, res, next);
                    }
                }
                catch (error) {
                    res.clearCookie('accessToken');
                    res.status(414).json('User Unauthorized');
                }
            }
            else {
                res.clearCookie('accessToken');
                res.status(414).json('User Unauthorized');
            }
        }
    });
}
exports.default = ProtectRouter;
