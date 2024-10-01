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
class AdminUseCase {
    constructor(adminRepository, encryptPassword, jwtToken) {
        this._adminRepository = adminRepository,
            this._encryptPassword = encryptPassword;
        this._jwtToken = jwtToken;
    }
    matchingAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield this._adminRepository.findAdmin(email);
                if (adminData == 'Email is not exist.') {
                    return {
                        status: 400,
                        message: adminData,
                    };
                }
                const encrypt = yield this._encryptPassword.compare(password, adminData.password);
                if (encrypt) {
                    return adminData;
                }
                return {
                    status: 400,
                    message: 'The password you entered is incorrect. Please try again.',
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
    createToken(adminId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = { _id: adminId, email: email };
                const accessToken = this._jwtToken.accessToken(admin);
                const refreshToken = this._jwtToken.refreshToken(admin);
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
    takeAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUsers = yield this._adminRepository.findAllUsers();
                return findUsers;
            }
            catch (error) {
                return {
                    status: 404,
                    message: "An error occurred",
                };
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this._adminRepository.findAndBlock(id);
                if (res) {
                    const findUsers = yield this._adminRepository.findAllUsers();
                    return findUsers;
                }
                return {
                    status: 400,
                    message: "An error occurred",
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
    addCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newcategory = yield this._adminRepository.saveCategory(name);
                if (newcategory) {
                    const allCategoryData = yield this._adminRepository.getCategory();
                    if (allCategoryData) {
                        return {
                            status: 200,
                            data: allCategoryData
                        };
                    }
                    return {
                        status: 400,
                        message: "An error occurred",
                    };
                }
                ;
                return {
                    status: 400,
                    message: "An error occurred",
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
    allCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCategoryData = yield this._adminRepository.getCategory();
                if (allCategoryData) {
                    return {
                        status: 200,
                        data: allCategoryData
                    };
                }
                return {
                    status: 400,
                    message: "An error occurred",
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
    blockCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this._adminRepository.blockCategory(id);
                if (res == 'success') {
                    const allCategoryData = yield this._adminRepository.getCategory();
                    if (allCategoryData) {
                        return {
                            status: 200,
                            data: allCategoryData
                        };
                    }
                    return {
                        status: 400,
                        message: "An error occurred",
                    };
                }
                else {
                    return {
                        status: 400,
                        message: "An error occurred",
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
    editCatagory(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield this._adminRepository.editCategory(req.body.id, req.body.newCategory);
                if (update) {
                    return {
                        status: 200,
                        message: "Successfully updated.",
                    };
                }
                return {
                    status: 400,
                    message: "Update failed.",
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
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this._adminRepository.deteteCategory(id);
                if (res) {
                    return {
                        status: 200,
                        message: "Successfully deteted.",
                    };
                }
                return {
                    status: 400,
                    message: "Deletion failed.",
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
    takeAllJob() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allData = yield this._adminRepository.findJobs();
                if (allData) {
                    return {
                        status: 200,
                        data: allData,
                    };
                }
                return {
                    status: 400,
                    message: "data not found",
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
    blockJob(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminRepository.blockJob(id);
                if (response) {
                    return {
                        status: 200,
                        message: "Job successfully blocked.",
                    };
                }
                return {
                    status: 400,
                    message: "Failed to block the job. Please try again.",
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
exports.default = AdminUseCase;
