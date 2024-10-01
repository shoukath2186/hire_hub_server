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
const adminRepository_1 = __importDefault(require("../../repository/adminRepository"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminRepository = new adminRepository_1.default();
const jwtToken = new generateToken_1.default();
function createAccessToken(decoded, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (decoded) {
            const admin = yield adminRepository.findAdminbyId(decoded._id);
            if (admin) {
                const newAccessToken = jwtToken.accessToken(admin);
                res.cookie('AdminAccessToken', newAccessToken, {
                    httpOnly: true,
                    maxAge: 1 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'strict',
                });
                req.admin = admin._id;
                next();
            }
            else {
                res.status(401).json('Admin not found');
            }
        }
        else {
            res.status(401).json('Invalid token');
        }
    });
}
const protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accessToken = req.cookies.AdminAccessToke;
    let refreshToken = req.cookies.AdminRefreshToken;
    const accessSecret = process.env.JWT_ACCESS_KEY;
    const refreshSecret = process.env.JWT_REFRESH_KEY;
    //console.log(1234,refreshToken);
    if (!refreshToken) {
        res.clearCookie('AdminAccessToken');
        res.status(401).json('No token');
        return;
    }
    if (accessToken) {
        if (accessSecret) {
            try {
                const decoded = jsonwebtoken_1.default.verify(accessToken, accessSecret);
                req.admin = decoded._id;
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                    console.error('Access token has expired:', error.message);
                    if (refreshToken) {
                        if (refreshSecret) {
                            try {
                                const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
                                yield createAccessToken(decoded, req, res, next);
                            }
                            catch (error) {
                                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                                    console.error('Refresh token has expired:', error.expiredAt);
                                    res.status(401).json('Refresh token has expired');
                                }
                                else {
                                    console.error('Refresh token verification failed:', error);
                                    res.status(401).json('Invalid refresh token');
                                }
                            }
                        }
                        else {
                            res.status(500).json('Missing JWT_REFRESH_KEY environment variable');
                        }
                    }
                    else {
                        res.status(401).json('No refresh token');
                    }
                }
                else {
                    console.error('Access token verification failed:', error);
                    res.status(401).json('Invalid access token');
                }
            }
        }
        else {
            res.status(500).json('Missing JWT_ACCESS_KEY environment variable');
        }
    }
    else {
        if (refreshToken) {
            if (refreshSecret) {
                try {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshSecret);
                    yield createAccessToken(decoded, req, res, next);
                }
                catch (error) {
                    if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                        console.error('Refresh token has expired:', error.expiredAt);
                        res.status(401).json('Refresh token has expired');
                    }
                    else {
                        console.error('Refresh token verification failed:', error);
                        res.status(401).json('Invalid refresh token');
                    }
                }
            }
            else {
                res.status(500).json('Missing JWT_REFRESH_KEY environment variable');
            }
        }
        else {
            res.status(401).json('No refresh token');
        }
    }
});
exports.default = protectAdmin;
