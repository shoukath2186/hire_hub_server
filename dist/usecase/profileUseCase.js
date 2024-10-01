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
class ProfileUseCase {
    constructor(profileRepository, cloudinary, ecryptPassword) {
        this._profileRepository = profileRepository;
        this._cloudinary = cloudinary;
        this._ecryptPassword = ecryptPassword;
    }
    createProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const ProfileData = yield this._profileRepository.createUserProfile(user);
                if (ProfileData) {
                    return {
                        status: 200,
                        data: ProfileData
                    };
                }
                else {
                    return {
                        status: 400,
                        data: 'Porfile is not found'
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
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const ProfileData = yield this._profileRepository.findUserJobProfile(req.user);
                    if (ProfileData) {
                        return {
                            status: 200,
                            data: ProfileData
                        };
                    }
                    return {
                        status: 400,
                        data: 'Porfile is not found'
                    };
                }
                else {
                    return {
                        status: 400,
                        data: 'User not found'
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
    updateJobProfile(req, file, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let Url = '';
                if (file) {
                    const oldResume = yield this._profileRepository.getResume(Id);
                    if (oldResume) {
                        yield this._cloudinary.removeS3File(oldResume);
                    }
                    Url = yield this._cloudinary.saveS3Resume(file);
                }
                const updateData = yield this._profileRepository.updateJobProfile(req, Id, Url);
                if (updateData) {
                    return {
                        status: 200,
                        data: updateData
                    };
                }
                return {
                    status: 400,
                    data: 'Update failed: Unable to complete the update operation. Please try again later'
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
    updateMainProfile(userId, userData, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let password = '';
                if (userData.newPassword && userData.previousPassword) {
                    password = yield this._ecryptPassword.encrypt(userData.newPassword);
                }
                let imageUrl = '';
                if (file) {
                    const getOldProfile = yield this._profileRepository.getProfile(userId);
                    if (getOldProfile != 'hello') {
                        yield this._cloudinary.removeS3File(getOldProfile);
                    }
                    imageUrl = yield this._cloudinary.saveS3Image(file);
                }
                const Data = yield this._profileRepository.updateProfile(userId, userData, imageUrl, password);
                if (Data) {
                    return {
                        status: 200,
                        data: Data
                    };
                }
                else {
                    return {
                        status: 400,
                        data: 'Update failed: Unable to complete the update operation.'
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
    getAplication(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aplications = yield this._profileRepository.getAplication(userId);
                if (aplications) {
                    return {
                        status: 200,
                        data: aplications
                    };
                }
                return {
                    status: 400,
                    data: 'fot foud aplication'
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
    getPorfileJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._profileRepository.getJobData(jobId);
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    data: 'fot foud aplication'
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
}
exports.default = ProfileUseCase;
