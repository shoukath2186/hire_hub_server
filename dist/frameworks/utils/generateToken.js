"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class JWTToken {
    accessToken(userData) {
        const SECRETKEY = process.env.JWT_ACCESS_KEY;
        if (SECRETKEY) {
            const payload = {
                _id: userData._id.toString(),
                user_role: userData.user_role,
            };
            const token = jsonwebtoken_1.default.sign(payload, SECRETKEY, {
                expiresIn: '15m'
            });
            return token;
        }
        throw new Error("JWT key is not defined!");
    }
    refreshToken(userData) {
        const SECRETKEY = process.env.JWT_REFRESH_KEY;
        if (SECRETKEY) {
            const payload = {
                _id: userData._id.toString(),
                user_role: userData.user_role,
            };
            const token = jsonwebtoken_1.default.sign(payload, SECRETKEY, {
                expiresIn: '10d'
            });
            return token;
        }
        throw new Error("JWT key is not defined!");
    }
}
exports.default = JWTToken;
