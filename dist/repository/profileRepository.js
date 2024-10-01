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
const mongoose_1 = __importDefault(require("mongoose"));
const profileModel_1 = __importDefault(require("../frameworks/models/profileModel"));
const userModel_1 = __importDefault(require("../frameworks/models/userModel"));
const applicationModel_1 = __importDefault(require("../frameworks/models/applicationModel"));
const JobModel_1 = __importDefault(require("../frameworks/models/JobModel"));
const ObjectId = mongoose_1.default.Types.ObjectId;
class ProfileRepository {
    createUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield profileModel_1.default.findOne({ userId: id });
                if (!profile) {
                    const newProfile = new profileModel_1.default({ userId: id });
                    let data = yield newProfile.save();
                    const User = data.userId;
                    const userProfile = yield profileModel_1.default.aggregate([{ $match: { userId: User } }, {
                            $lookup: {
                                from: 'users',
                                let: { userId: '$userId' },
                                pipeline: [
                                    {
                                        $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$userId' }] } }
                                    }, {
                                        $project: { _id: 0, user_name: 1, last_name: 1, email: 1, profilePicture: 1 }
                                    }
                                ], as: 'userData'
                            }
                        },]);
                    return userProfile;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    findUserJobProfile(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PorfileData = yield profileModel_1.default.findOne({ userId: Id });
                if (PorfileData) {
                    const User = PorfileData.userId;
                    const userProfileData = yield profileModel_1.default.aggregate([{ $match: { userId: User } }, {
                            $lookup: {
                                from: 'users',
                                let: { userId: '$userId' },
                                pipeline: [
                                    {
                                        $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$userId' }] } }
                                    }, {
                                        $project: { _id: 0, user_name: 1, last_name: 1, email: 1, profilePicture: 1 }
                                    }
                                ], as: 'userData'
                            }
                        },]);
                    return userProfileData;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    updateJobProfile(changeData, userId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (url) {
                    yield profileModel_1.default.updateOne({ userId: userId }, { $set: { resume: url } });
                }
                const updatedProfile = yield profileModel_1.default.findOneAndUpdate({ userId: userId }, { $set: changeData }, { new: true, runValidators: true });
                if (!updatedProfile) {
                    return false;
                }
                return updatedProfile;
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    getResume(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield profileModel_1.default.findOne({ userId: userId });
                if (profile) {
                    return profile.resume;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    updateProfile(Id, data, prfile, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (prfile) {
                    yield userModel_1.default.updateOne({ _id: Id }, { $set: { profilePicture: prfile } });
                }
                if (password) {
                    yield userModel_1.default.updateOne({ _id: Id }, { $set: { password: password } });
                }
                const updatedProfile = yield userModel_1.default.findOneAndUpdate({ _id: Id }, { $set: data }, { new: true, runValidators: true });
                if (updatedProfile) {
                    const userData = yield userModel_1.default.findOne({ _id: Id }, { user_name: 1, last_name: 1, _id: 1, phone: 1, email: 1, profilePicture: 1, user_role: 1 });
                    if (userData) {
                        return userData;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Profile = yield userModel_1.default.findOne({ _id: id });
                if (Profile) {
                    return Profile.profilePicture;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    findUserPassword(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Profile = yield userModel_1.default.findOne({ _id: Id });
                if (Profile) {
                    return Profile.password;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    getAplication(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(userId);
                // const takeApplication=await ApplicationModel.find({})
                // console.log(takeApplication);
                const responses = yield applicationModel_1.default.aggregate([{ $match: { profileId: objectId } },
                    {
                        $lookup: {
                            from: 'jobs', localField: 'jobId', foreignField: '_id', as: 'jobData'
                        }
                    },
                    { $unwind: { path: '$jobData', preserveNullAndEmptyArrays: true } }, {
                        $project: {
                            status: 1,
                            createdAt: 1,
                            jobTitle: '$jobData.title',
                            companyName: '$jobData.name',
                            jobId: '$jobData._id'
                        }
                    }
                ]);
                //   console.log(responses);
                return responses;
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
    getJobData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield JobModel_1.default.aggregate([
                    {
                        $match: { _id: new ObjectId(id) }
                    },
                    {
                        $addFields: { employerIdAsObjectId: { $toObjectId: "$employer_id" } }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'employerIdAsObjectId',
                            foreignField: '_id',
                            as: 'employerDetails'
                        }
                    },
                    {
                        $unwind: { path: '$employerDetails', }
                    },
                    {
                        $project: { name: 1, contact: 1, location: 1, salary: 1, title: 1, job_type: 1,
                            category: 1,
                            skill: 1,
                            education: 1,
                            description: 1,
                            applications: 1,
                            logo: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            employerDetails: {
                                profilePicture: 1,
                                _id: 1
                            }
                        }
                    }
                ]);
                console.log(data);
                if (data) {
                    return data;
                }
                return false;
            }
            catch (error) {
                console.log('Error in Profile repository:', error);
                throw new Error('Profile repository failed');
            }
        });
    }
}
exports.default = ProfileRepository;
