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
const categoryModel_1 = __importDefault(require("../frameworks/models/categoryModel"));
const JobModel_1 = __importDefault(require("../frameworks/models/JobModel"));
const applicationModel_1 = __importDefault(require("../frameworks/models/applicationModel"));
const profileModel_1 = __importDefault(require("../frameworks/models/profileModel"));
class JobRepository {
    findCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const allCalegory = yield categoryModel_1.default.find({ is_block: false }, { _id: 1, name: 1 });
            if (allCalegory) {
                return allCalegory;
            }
            return 'faild';
        });
    }
    saveJob(companyName, contact, location, salary, title, type, description, category, skill, education, create) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newJob = new JobModel_1.default({
                    name: companyName, employer_id: create, category: category, contact: contact, location: location, salary: salary, title: title, description, job_type: type, skill: skill, education: education, applications: []
                });
                const savedJob = yield newJob.save();
                if (savedJob) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log('Error in repository while saving job:', error);
                throw new Error('Job save failed');
            }
        });
    }
    findEmployerJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allJob = yield JobModel_1.default.find({ employer_id: id }, { employer_id: 0, applications: 0 }).sort({ _id: -1 });
                if (allJob) {
                    return allJob;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    DeleteJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedata = yield JobModel_1.default.deleteOne({ _id: id });
                if (deletedata.deletedCount == 1) {
                    return true;
                }
                else {
                    return false;
                }
                ;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    UpdateJob(_id, companyName, contact, location, salary, title, job_type, description, category, skill, education) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {};
                if (companyName)
                    updateData.name = companyName;
                if (contact)
                    updateData.contact = contact;
                if (location)
                    updateData.location = location;
                if (salary)
                    updateData.salary = salary;
                if (title)
                    updateData.title = title;
                if (job_type)
                    updateData.job_type = job_type;
                if (description)
                    updateData.description = description;
                if (category)
                    updateData.category = category;
                if (skill)
                    updateData.skill = skill;
                const updatedJob = yield JobModel_1.default.findByIdAndUpdate(_id, { $set: updateData }, { new: true, runValidators: true });
                if (updatedJob) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    findHomeJob() {
        return __awaiter(this, arguments, void 0, function* (limit = 9) {
            try {
                const limitValue = Number(limit);
                const allJob = yield JobModel_1.default.aggregate([
                    { $match: { is_blocked: false } },
                    {
                        $addFields: { employerIdAsObjectId: { $toObjectId: "$employer_id" } }
                    },
                    {
                        $lookup: { from: 'users', localField: 'employerIdAsObjectId', foreignField: '_id', as: 'employerDetails' }
                    },
                    {
                        $unwind: { path: '$employerDetails', }
                    },
                    {
                        $project: {
                            name: 1, contact: 1, location: 1, salary: 1, title: 1, job_type: 1, category: 1, skill: 1,
                            education: 1, description: 1, applications: 1, logo: 1, createdAt: 1, updatedAt: 1,
                            employerDetails: {
                                profilePicture: 1,
                                _id: 1
                            }
                        }
                    }, { $sort: { _id: -1 } }, { $limit: limitValue }
                ]);
                if (allJob) {
                    return allJob;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    findLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield JobModel_1.default.find({}, { location: 1, _id: 0 });
                if (location) {
                    return location;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    searchJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { key, category, location } = data;
                const pipeline = [];
                const matchCriteria = [];
                if (key) {
                    matchCriteria.push({
                        $or: [
                            { title: { $regex: key, $options: "i" } },
                            { description: { $regex: key, $options: "i" } }
                        ]
                    });
                }
                if (category) {
                    matchCriteria.push({
                        category: { $regex: category, $options: "i" }
                    });
                }
                if (location) {
                    matchCriteria.push({
                        location: { $regex: location, $options: "i" }
                    });
                }
                if (matchCriteria.length > 0) {
                    pipeline.push({ $match: { $and: matchCriteria } });
                }
                else {
                    pipeline.push({ $match: {} });
                }
                pipeline.push({
                    $addFields: { employerIdAsObjectId: { $toObjectId: "$employer_id" } }
                }, {
                    $lookup: { from: 'users', localField: 'employerIdAsObjectId', foreignField: '_id', as: 'employerDetails' }
                }, {
                    $unwind: { path: '$employerDetails', preserveNullAndEmptyArrays: true }
                }, {
                    $project: {
                        name: 1, contact: 1, location: 1, salary: 1, title: 1, job_type: 1, category: 1, skill: 1,
                        education: 1, description: 1, applications: 1, logo: 1, createdAt: 1, updatedAt: 1,
                        employerDetails: { profilePicture: 1, _id: 1 }
                    }
                }, { $limit: 9 }, { $sort: { _id: -1 } });
                const jobs = yield JobModel_1.default.aggregate(pipeline).exec();
                return jobs;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    createApplication(cover, userId, employerId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobProfile = yield profileModel_1.default.findOne({ userId: userId });
                if (jobProfile) {
                    yield JobModel_1.default.updateOne({ _id: jobId }, { $push: { applications: userId } });
                    const Application = new applicationModel_1.default({
                        coverLetter: cover,
                        profileId: userId,
                        employerId: employerId,
                        jobId: jobId
                    });
                    const newApplication = yield Application.save();
                    if (newApplication) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    checkExists(userId, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = mongoose_1.default.Types.ObjectId.isValid(Id) ? new mongoose_1.default.Types.ObjectId(Id) : null;
                const response = yield applicationModel_1.default.findOne({ jobId: objectId, profileId: userId });
                if (response) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    takeApplications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(userId);
                const applications = yield applicationModel_1.default.aggregate([
                    {
                        $match: { employerId: objectId },
                    }, {
                        $addFields: { profileIdStr: { $toString: "$profileId" } }
                    },
                    {
                        $lookup: { from: 'users', localField: 'profileId', foreignField: '_id', as: 'profile', },
                    },
                    {
                        $lookup: { from: 'jobs', localField: 'jobId', foreignField: '_id', as: 'job', },
                    },
                    {
                        $lookup: { from: 'users', localField: 'employerId', foreignField: '_id', as: 'employer', },
                    }, { $unwind: '$profile', },
                    { $unwind: '$job', },
                    { $unwind: '$employer', },
                    {
                        $project: { _id: 1, jobTitle: '$job.title', applicantName: '$profile.user_name', email: '$profile.email', appliedDate: '$createdAt', status: 1, },
                    }, { $sort: { _id: -1 } }
                ]);
                if (applications) {
                    return applications;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield applicationModel_1.default.updateOne({ _id: id }, { $set: { status: status } });
                if (update.modifiedCount == 1) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const application = yield applicationModel_1.default.findById(id);
                const Profile = yield profileModel_1.default.findOne({ userId: application.profileId });
                if (Profile) {
                    return Profile;
                }
                else {
                    return false;
                }
                ;
            }
            catch (error) {
                console.log('Error in job repository:', error);
                throw new Error('Job repository failed');
            }
        });
    }
}
exports.default = JobRepository;
