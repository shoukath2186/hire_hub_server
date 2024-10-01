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
class JobController {
    constructor(jobUseCase) {
        this._jobUseCase = jobUseCase;
    }
    getAllCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this._jobUseCase.allCategory();
                if (category.status == 200) {
                    res.status(200).json(category.data);
                    return;
                }
                res.status(category.status).json(category.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const save = yield this._jobUseCase.newJob(req);
                if (save.status == 200) {
                    res.status(save.status).json(save.message);
                    return;
                }
                else {
                    res.status(save.status).json(save.message);
                    return;
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEmployerJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employerId = req.user;
                if (employerId) {
                    const Jobs = yield this._jobUseCase.getEmployerJob(employerId);
                    if (Jobs) {
                        res.status(200).json(Jobs);
                        return;
                    }
                    res.status(Jobs.status).json(Jobs.message);
                }
                else {
                    res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    delereJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteJob = yield this._jobUseCase.deleteJob(req.body.Id);
                if (deleteJob.status == 200) {
                    const employerId = req.user;
                    if (employerId) {
                        const Jobs = yield this._jobUseCase.getEmployerJob(employerId);
                        if (Jobs) {
                            res.status(200).json(Jobs);
                            return;
                        }
                        res.status(Jobs.status).json(Jobs.message);
                    }
                    else {
                        res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.');
                    }
                }
                else {
                    res.status(deleteJob.status).json(deleteJob.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateJobData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield this._jobUseCase.updateJob(req);
                if (update.status == 200) {
                    const employerId = req.user;
                    if (employerId) {
                        const Jobs = yield this._jobUseCase.getEmployerJob(employerId);
                        if (Jobs) {
                            res.status(200).json(Jobs);
                            return;
                        }
                        res.status(Jobs.status).json(Jobs.message);
                    }
                }
                else {
                    res.status(update.status).json(update.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    takeJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._jobUseCase.takeJob();
                if (data.status == 200) {
                    res.status(200).json(data.data);
                }
                else {
                    res.status(data.status).json(data.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    getJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit;
                const data = yield this._jobUseCase.getJobs(limit);
                if (data.status == 200) {
                    res.status(200).json(data.data);
                }
                else {
                    res.status(data.status).json(data.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    allLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allLocation = yield this._jobUseCase.allLocation();
                if (allLocation.status == 200) {
                    res.status(200).json(allLocation.data);
                }
                else {
                    res.status(allLocation.status).json(allLocation.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    searchJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchData = yield this._jobUseCase.serchData(req.query);
                if (searchData.status == 200) {
                    res.status(200).json(searchData.data);
                }
                else {
                    res.status(searchData.status).json(searchData.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    createApplication(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const resposns = yield this._jobUseCase.saveApplication(req.user, req.body);
                    res.status(resposns.status).json(resposns.message);
                }
                else {
                    res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const response = yield this._jobUseCase.checkExists(req.user, req.query.Id);
                    res.status(response.status).json(response.message);
                }
                else {
                    res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    jobApplications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    const response = yield this._jobUseCase.takeJobApplications(req.user);
                    if (response.status == 200) {
                        res.status(200).json(response.data);
                    }
                    else {
                        res.status(response.status).json(response.message);
                    }
                }
                else {
                    res.status(401).json('Unauthorized: Employer ID is undefined. Please log in as an employer to access this resource.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.query;
                const response = yield this._jobUseCase.updateStatus(id, status);
                if (response.status == 200) {
                    res.status(200).json(response.message);
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
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this._jobUseCase.getProfileData(req.query.id);
                if (profile.status == 200) {
                    res.status(200).json(profile.data);
                }
                else {
                    res.status(profile.status).json(profile.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = JobController;
