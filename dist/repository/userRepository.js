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
const OTPModel_1 = __importDefault(require("../frameworks/models/OTPModel"));
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findOne({ email: email });
            return userData ? userData.toObject() : null;
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new userModel_1.default(user);
            const savedUser = yield newUser.save();
            return savedUser ? savedUser.toObject() : null;
        });
    }
    saveOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpData = new OTPModel_1.default({ email, otp });
                const savedOtp = yield otpData.save();
                return savedOtp;
            }
            catch (error) {
                console.error('Error saving OTP data:', error);
                throw error;
            }
        });
    }
    deleteOtp(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield OTPModel_1.default.deleteOne({ _id: id });
                // console.log(result);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    checkExistOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpData = yield OTPModel_1.default.findOne({ email });
                const userData = yield userModel_1.default.findOne({ email });
                if (!userData) {
                    return 'User does not exist.';
                }
                if (!otpData) {
                    return 'Email does not exist.';
                }
                return otpData.otp;
            }
            catch (error) {
                console.error('Error checking OTP:', error);
                return 'An error occurred while verifying OTP.';
            }
        });
    }
    retrieveUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.default.updateOne({ email: email }, { $set: { otp_verify: true } });
                const userData = yield userModel_1.default.findOne({ email }, { user_name: 1, last_name: 1, _id: 1, phone: 1, email: 1, profilePicture: 1, user_role: 1 });
                if (!userData) {
                    return 'User does not exist.';
                }
                return userData;
            }
            catch (error) {
                console.error('Error : retrieveUserByEmail', error);
            }
        });
    }
    alluserData(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findOne({ email });
                if (!userData) {
                    return 'User does not exist.';
                }
                return userData;
            }
            catch (error) {
                console.error('Error : retrieveUserByEmail', error);
            }
        });
    }
    saveTokan(token, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userModel_1.default.updateOne({ email: email }, { $set: { token: token } });
                // console.log(444,data); 
                if (data.matchedCount == 0) {
                    return 'User not found. Please register as a new user.';
                }
                ;
                if (data.modifiedCount == 1) {
                    return 'Success';
                }
            }
            catch (error) {
                console.error('Error : saveToken', error);
            }
        });
    }
    checkingToken(password, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findOne({ token: token });
            if (!userData) {
                return 'No user found with the provided token. Please check the token or contact support.';
            }
            const update = yield userModel_1.default.updateOne({ token: token }, { $set: { token: '', password: password } });
            if (update.matchedCount === 1) {
                return 'Password reset successfully.';
            }
            else {
                return 'Password reset failed. Please try again or contact support.';
            }
        });
    }
    findDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findById(id);
            return userData ? userData.toObject() : null;
        });
    }
    checkUserBlock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let User = yield userModel_1.default.findById(id);
            return User === null || User === void 0 ? void 0 : User.isBlocked;
        });
    }
    FindbyIdforAccessToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = yield userModel_1.default.findById({ _id: id }, { _id: 1, user_role: 1 });
            if (User) {
                return User;
            }
            else {
                return false;
            }
        });
    }
}
exports.default = UserRepository;
