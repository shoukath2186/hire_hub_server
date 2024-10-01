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
const JobModel_1 = __importDefault(require("../frameworks/models/JobModel"));
const applicationModel_1 = __importDefault(require("../frameworks/models/applicationModel"));
class GraphRepository {
    createGarphData() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalSeeker = yield userModel_1.default.countDocuments({ user_role: 'seeker' });
            const totalEmployer = yield userModel_1.default.countDocuments({ user_role: 'employer' });
            const totalJob = yield JobModel_1.default.countDocuments({});
            const totalUsers = yield userModel_1.default.countDocuments({});
            const totalApplication = yield applicationModel_1.default.countDocuments({});
            const data = yield this.createGraphData();
            if (data) {
                return { data, totalApplication, totalEmployer, totalJob, totalUsers, totalSeeker };
            }
            return false;
        });
    }
    getCurrentDateInfo() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        return { currentYear, currentMonth };
    }
    getYearlyData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentYear } = this.getCurrentDateInfo();
            const jobData = yield JobModel_1.default.aggregate([
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                        totalJobs: { $sum: 1 },
                    },
                },
                {
                    $match: { "_id.year": currentYear },
                },
                {
                    $sort: { "_id.month": 1 },
                },
            ]);
            const userData = yield userModel_1.default.aggregate([
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                        totalUsers: { $sum: 1 },
                    },
                },
                {
                    $match: { "_id.year": currentYear },
                },
                {
                    $sort: { "_id.month": 1 },
                },
            ]);
            const monthlyJobs = Array(12).fill(0);
            const monthlyUsers = Array(12).fill(0);
            jobData.forEach(job => {
                const monthIndex = job._id.month - 1;
                monthlyJobs[monthIndex] = job.totalJobs;
            });
            userData.forEach(user => {
                const monthIndex = user._id.month - 1;
                monthlyUsers[monthIndex] = user.totalUsers;
            });
            return {
                jobData: monthlyJobs,
                userData: monthlyUsers,
            };
        });
    }
    getMonthlyData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentYear, currentMonth } = this.getCurrentDateInfo();
            try {
                const jobData = yield JobModel_1.default.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: "$createdAt" }, currentYear] },
                                    { $eq: [{ $month: "$createdAt" }, currentMonth] },
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfMonth: "$createdAt" }, // This will give you the day of the month directly
                            totalJobs: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]);
                const userData = yield userModel_1.default.aggregate([
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: [{ $year: "$createdAt" }, currentYear] },
                                    { $eq: [{ $month: "$createdAt" }, currentMonth] },
                                ],
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfMonth: "$createdAt" },
                            totalUsers: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]);
                const dailyJobs = Array(31).fill(0);
                const dailyUsers = Array(31).fill(0);
                jobData.forEach(job => {
                    const dayIndex = job._id - 1; // Fix here
                    if (dayIndex >= 0 && dayIndex < dailyJobs.length) { // Check for valid index
                        dailyJobs[dayIndex] = job.totalJobs;
                    }
                });
                userData.forEach(user => {
                    const dayIndex = user._id - 1; // Fix here
                    if (dayIndex >= 0 && dayIndex < dailyUsers.length) { // Check for valid index
                        dailyUsers[dayIndex] = user.totalUsers;
                    }
                });
                return {
                    jobData: dailyJobs,
                    userData: dailyUsers,
                };
            }
            catch (error) {
                console.error('Error fetching monthly data:', error);
                return {
                    jobData: Array(31).fill(0),
                    userData: Array(31).fill(0),
                };
            }
        });
    }
    createGraphData() {
        return __awaiter(this, void 0, void 0, function* () {
            const yearlyData = yield this.getYearlyData();
            const monthlyData = yield this.getMonthlyData();
            return {
                yearlyData,
                monthlyData,
            };
        });
    }
}
exports.default = GraphRepository;
