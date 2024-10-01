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
class ProfileController {
    constructor(ProfileUseCase) {
        this._profileUseCase = ProfileUseCase;
    }
    createJobProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileData = yield this._profileUseCase.createProfile(req);
                if (profileData.status == 200) {
                    res.status(200).json(profileData.data);
                }
                else {
                    res.status(profileData.status).json(profileData.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProfileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileData = yield this._profileUseCase.getProfile(req);
                if (profileData.status == 200) {
                    res.status(200).json(profileData.data);
                }
                else {
                    res.status(profileData.status).json(profileData.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateJobProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const userId = req.user;
                    const upDate = yield this._profileUseCase.updateJobProfile(req.body, req.file, userId);
                    if (upDate.status == 200) {
                        res.status(200).json(upDate.data);
                    }
                    else {
                        res.status(upDate.status).json(upDate.message);
                    }
                }
                else {
                    res.status(401).json('Authentication failed. Please log in to continue.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateMainProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const UserData = yield this._profileUseCase.updateMainProfile(req.user, req.body, req.file);
                    if (UserData.status == 200) {
                        res.status(200).json(UserData.data);
                    }
                    else {
                        res.status(UserData.status).json(UserData.message);
                    }
                }
                else {
                    res.status(401).json('Authentication failed. Please log in to continue.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    seekerAplication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const response = yield this._profileUseCase.getAplication(req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json('Authentication failed. Please log in to continue.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getJobData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._profileUseCase.getPorfileJob(req.query.jobId);
                if (response.status == 200) {
                    res.status(200).json(response.data);
                }
                else {
                    res.status(response.status).json(response.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ProfileController;
