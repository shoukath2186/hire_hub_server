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
class JobUseCases {
    constructor(jobRepository, cloudinary) {
        this._jobRepository = jobRepository,
            this._cloudinary = cloudinary;
    }
    allCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allData = yield this._jobRepository.findCategory();
                if (allData == 'faild') {
                    return {
                        status: 400,
                        message: 'faild Category fetching',
                    };
                }
                return {
                    status: 200,
                    data: allData
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
    newJob(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { companyName, contact, location, salary, title, type, description, category, skill, education } = req.body;
                const creater = req.user;
                const save = yield this._jobRepository.saveJob(companyName, contact, location, salary, title, type, description, category, skill, education, creater);
                if (save) {
                    console.log('success');
                    return {
                        status: 200,
                        message: 'New job creation successful'
                    };
                }
                ;
                return {
                    status: 400,
                    message: 'Failed to create job'
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
    getEmployerJob(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allJob = yield this._jobRepository.findEmployerJob(Id);
                if (allJob) {
                    return allJob;
                }
                return {
                    status: 400,
                    message: 'Failed to get Employer job'
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
    deleteJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const delet = yield this._jobRepository.DeleteJob(id);
                if (delet) {
                    return {
                        status: 200,
                        message: 'deletetion successfull'
                    };
                }
                ;
                return {
                    status: 400,
                    message: 'deletetion faild'
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
    updateJob(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name, contact, location, salary, title, job_type, description, category, skill, education } = req.body;
                //  console.log(88888,req.body);
                const Update = yield this._jobRepository.UpdateJob(_id, name, contact, location, salary, title, job_type, description, category, skill, education);
                if (Update) {
                    return {
                        status: 200,
                        message: 'successful'
                    };
                }
                return {
                    status: 400,
                    message: 'falde update'
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
    takeJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this._jobRepository.findHomeJob();
                if (jobs) {
                    return {
                        status: 200,
                        data: jobs
                    };
                }
                return {
                    status: 400,
                    message: 'not find jobs'
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
    getJobs(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield this._jobRepository.findHomeJob(limit);
                if (jobs) {
                    return {
                        status: 200,
                        data: jobs
                    };
                }
                return {
                    status: 400,
                    message: 'not find jobs'
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
    allLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._jobRepository.findLocation();
                if (data) {
                    return {
                        status: 200,
                        data: data
                    };
                }
                return {
                    status: 400,
                    message: 'not find Location'
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
    serchData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(data);
                const JobData = yield this._jobRepository.searchJob(data);
                if (JobData) {
                    return {
                        status: 200,
                        data: JobData
                    };
                }
                return {
                    status: 400,
                    message: 'No jobs found matching the search criteria.'
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
    saveApplication(userId, cover) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this._jobRepository.createApplication(cover.cover, userId, cover.EmplyerId, cover.jobId);
                if (res) {
                    return {
                        status: 200,
                        message: "Application successfully created.",
                    };
                }
                else {
                    return {
                        status: 400,
                        message: "Failed to create the application. Please try again later.",
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
    checkExists(UserId, Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(1234);
                const check = yield this._jobRepository.checkExists(UserId, Id);
                if (check) {
                    return {
                        status: 200,
                        message: 'No found Userdata'
                    };
                }
                return {
                    status: 400,
                    message: 'User alrady applyde.'
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
    takeJobApplications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allApplication = yield this._jobRepository.takeApplications(userId);
                if (allApplication) {
                    return {
                        status: 200,
                        data: allApplication,
                    };
                }
                return {
                    status: 400,
                    data: 'data feching faild.'
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
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updation = yield this._jobRepository.updateStatus(id, status);
                if (updation) {
                    return {
                        status: 200,
                        message: "Updation successful.",
                    };
                }
                return {
                    status: 400,
                    message: "Updation Faild",
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
    getProfileData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileData = yield this._jobRepository.getProfile(id);
                if (profileData) {
                    return {
                        status: 200,
                        data: profileData,
                    };
                }
                return {
                    status: 400,
                    message: "Profile Not found",
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
exports.default = JobUseCases;
