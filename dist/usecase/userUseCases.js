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
class UserUsecase {
    constructor(UserRepository, generateOtp, encryptPassword, encryptOtp, generateMail, jwtToken, stringGenerator, forgotPasswordLink) {
        this._userRepository = UserRepository;
        this._generateOtp = generateOtp;
        this._encryptPassword = encryptPassword;
        this._encryptOtp = encryptOtp;
        this._generateMail = generateMail;
        this._jwtToken = jwtToken;
        this._stringGenerator = stringGenerator;
        this._forgotPasswordLink = forgotPasswordLink;
    }
    checkExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExist = yield this._userRepository.findByEmail(email);
                if (userExist) {
                    return {
                        status: 400,
                        message: "User already exist",
                    };
                }
                else {
                    return {
                        status: 200,
                        message: "User does not exist",
                    };
                }
            }
            catch (error) {
                return {
                    status: 400,
                    message: "An error occurred",
                };
            }
        });
    }
    signup(user_name, last_name, phone, email, password, user_role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = this._generateOtp.createOtp();
                const hashedPassword = yield this._encryptPassword.encrypt(password);
                const userDate = {
                    user_name,
                    last_name,
                    email,
                    phone,
                    password: hashedPassword,
                    user_role
                };
                yield this._userRepository.saveUser(userDate);
                const hashedOtp = yield this._encryptOtp.encrypt(otp);
                const otpdate = yield this._userRepository.saveOtp(email, hashedOtp);
                yield this._generateMail.sendMail(email, otp);
                return {
                    status: 200,
                    message: "Verification otp sent to your email",
                    data: otpdate.email,
                    _id: otpdate._id
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    deleteOtpData(id) {
        try {
            setTimeout(() => {
                this._userRepository.deleteOtp(id);
            }, 60000);
        }
        catch (error) {
            return {
                status: 404,
                message: "An error occurred",
            };
        }
    }
    verify_otp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userRepository.checkExistOtp(email);
                if (response == 'Email does not exist.') {
                    return {
                        status: 400,
                        message: response,
                    };
                }
                if (response == 'User does not exist.') {
                    return {
                        status: 400,
                        message: response,
                    };
                }
                //console.log(response);
                const hashedOtp = yield this._encryptOtp.compare(parseInt(otp), response);
                //console.log(hashedOtp);
                if (hashedOtp) {
                    return {
                        status: 200,
                        message: 'varification succussfull.',
                    };
                }
                else {
                    return {
                        status: 400,
                        message: 'OTP did not match.',
                    };
                }
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    createNewOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = this._generateOtp.createOtp();
                const hashedOtp = yield this._encryptOtp.encrypt(otp);
                const otpData = yield this._userRepository.saveOtp(email, hashedOtp);
                yield this._generateMail.sendMail(email, otp);
                return {
                    status: 200,
                    message: 'OTP has been successfully created. Please check your email.',
                    email: otpData.email,
                    _id: otpData._id
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    fetchUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this._userRepository.retrieveUserByEmail(email);
                if (userData == 'User does not exist.') {
                    return {
                        status: 400,
                        message: userData,
                    };
                }
                return {
                    status: 200,
                    data: userData,
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    createToken(UserData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = this._jwtToken.accessToken(UserData);
                const refreshToken = this._jwtToken.refreshToken(UserData);
                return {
                    accessToken,
                    refreshToken
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    verify_login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this._userRepository.alluserData(data.email);
                //console.log(userData);
                if (userData == 'User does not exist.') {
                    return {
                        status: 400,
                        message: userData,
                    };
                }
                if ((userData === null || userData === void 0 ? void 0 : userData.otp_verify) == false) {
                    return {
                        status: 400,
                        message: 'OTP is not verified.'
                    };
                }
                if ((userData === null || userData === void 0 ? void 0 : userData.isBlocked) == true) {
                    return {
                        status: 400,
                        message: 'User is Blocked.'
                    };
                }
                //console.log(9999,userData);
                const hashedPassword = userData === null || userData === void 0 ? void 0 : userData.password;
                const passwordMatch = yield this._encryptPassword.compare(data.password, hashedPassword);
                // console.log(222,passwordMatch);
                if (passwordMatch) {
                    return {
                        status: 200,
                        data: userData
                    };
                }
                else {
                    return {
                        status: 400,
                        message: 'The password you entered is incorrect. Please try again.'
                    };
                }
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomStr = yield this._stringGenerator.randomstring();
                const res = yield this._userRepository.saveTokan(randomStr, email);
                if (res == 'Success') {
                    yield this._forgotPasswordLink.sendMail(email, randomStr);
                    return {
                        status: 200,
                        message: res
                    };
                }
                else {
                    return {
                        status: 400,
                        message: res
                    };
                }
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    reset_Password(password, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield this._encryptPassword.encrypt(password);
                const check = yield this._userRepository.checkingToken(hashedPassword, token);
                console.log(check);
                if (check == 'Password reset successfully.') {
                    return {
                        status: 200,
                        message: 'Password reset successfully. Please log in again.'
                    };
                }
                return {
                    status: 400,
                    message: check
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    logout(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._userRepository.findDataById(id);
                if (response) {
                    return {
                        status: 200,
                        message: "User exist",
                    };
                }
                else {
                    return {
                        status: 400,
                        message: "User Not Found.",
                    };
                }
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    signupGoogle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield this._encryptPassword.encrypt(data.id);
                const userDate = {
                    user_name: data.given_name,
                    last_name: data.family_name || '',
                    email: data.email,
                    phone: 0,
                    profilePicture: data.picture,
                    otp_verify: true,
                    password: hashedPassword,
                    user_role: 'seeker'
                };
                const save = yield this._userRepository.saveUser(userDate);
                return {
                    status: 200,
                    data: save,
                };
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    signInGoogle(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this._userRepository.alluserData(email);
                if (userData.isBlocked) {
                    return {
                        status: 400,
                        message: 'User is Blocked.'
                    };
                }
                return userData;
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
}
exports.default = UserUsecase;
