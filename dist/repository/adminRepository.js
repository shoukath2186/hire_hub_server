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
// import AdminRepo from "../usecase/interfaces/admin/IAdminRepo";
const userModel_1 = __importDefault(require("../frameworks/models/userModel"));
const admin_1 = __importDefault(require("../frameworks/models/admin"));
const categoryModel_1 = __importDefault(require("../frameworks/models/categoryModel"));
const JobModel_1 = __importDefault(require("../frameworks/models/JobModel"));
class AdminRepository {
    findAdmin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = yield admin_1.default.findOne({ email: email });
            if (adminData) {
                return adminData;
            }
            return 'Email is not exist.';
        });
    }
    ;
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.default.find({}, { _id: 1, last_name: 1, user_name: 1, user_role: 1, email: 1, phone: 1, profilePicture: 1, isBlocked: 1, createdAt: 1 }).sort({ _id: -1 });
                return users;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    findAndBlock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(id);
                const res = yield userModel_1.default.findByIdAndUpdate(id, { $set: { isBlocked: !(user === null || user === void 0 ? void 0 : user.isBlocked) } });
                return res;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    findAdminbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield admin_1.default.findById(id, { id: 1, email: 1 });
                return admin;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    saveCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = new categoryModel_1.default({ name: name });
                const category = yield newCategory.save();
                return category;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const allData = await CategoryModal.find({}, { _id: 1, name: 1, is_block: 1 }).sort({ _id: -1 })
                const allData = yield categoryModel_1.default.aggregate([
                    {
                        // Add a field that converts the ObjectId _id to a string
                        $addFields: {
                            categoryIdString: { $toString: '$_id' }
                        }
                    },
                    {
                        $lookup: {
                            from: 'jobs',
                            localField: 'categoryIdString',
                            foreignField: 'category',
                            as: 'categoryData'
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            is_block: 1,
                            total: { $size: "$categoryData" }
                        }
                    }, { $sort: { _id: -1 } }
                ]);
                return allData;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    blockCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield categoryModel_1.default.findById(id);
                if (category) {
                    yield categoryModel_1.default.updateOne({ _id: id }, { $set: { is_block: !category.is_block } });
                    return 'success';
                }
                return 'faild';
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    editCategory(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield categoryModel_1.default.updateOne({ _id: id }, { $set: { name: value } });
                if (update.modifiedCount == 1) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    deteteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedata = yield categoryModel_1.default.deleteOne({ _id: id });
                if (deletedata.acknowledged) {
                    return true;
                }
                ;
                return false;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    findJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allData = yield JobModel_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            let: { employerId: { $toObjectId: "$employer_id" } },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$employerId"] } } }
                            ],
                            as: 'EmployerData'
                        }
                    },
                    { $lookup: {
                            from: 'categories',
                            let: { categoryId: { $toObjectId: "$category" } },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$categoryId"] } } }
                            ],
                            as: 'category'
                        } },
                    {
                        $project: {
                            logo: '$EmployerData.profilePicture',
                            name: 1,
                            location: 1,
                            title: 1,
                            applications: 1,
                            category: '$category.name',
                            is_blocked: 1
                        }
                    }, { $sort: { _id: -1 } }
                ]);
                if (allData) {
                    return allData;
                }
                ;
                return false;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
    blockJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield JobModel_1.default.findOne({ _id: id });
                const update = yield JobModel_1.default.updateOne({ _id: id }, { $set: { is_blocked: !(data === null || data === void 0 ? void 0 : data.is_blocked) } });
                if (update.modifiedCount == 1) {
                    return true;
                }
                ;
                return false;
            }
            catch (error) {
                console.error('Error find in admin Repository', error);
                throw error;
            }
        });
    }
}
exports.default = AdminRepository;
