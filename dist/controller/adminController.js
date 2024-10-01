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
class AdminController {
    constructor(adminUseCase) {
        this.useCase = adminUseCase;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.useCase.matchingAdmin(req.body.email, req.body.password);
                if (response.status == 400) {
                    return res.status(response.status).json(response.message);
                }
                const createToken = yield this.useCase.createToken(response._id, response.email);
                const { refreshToken, accessToken } = createToken;
                res.cookie('AdminRefreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 10 * 24 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'none',
                });
                res.cookie('AdminAccessToken', accessToken, {
                    httpOnly: true,
                    maxAge: 1 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: 'none',
                });
                return res.status(200).json({ email: response.email, name: response.name });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allData = yield this.useCase.takeAllUser();
                // console.log(111,allData);
                if (allData) {
                    return res.status(200).json({ data: allData });
                }
                else {
                    return res.status(400).json('faild.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const allData = yield this.useCase.blockUser(id);
                if (allData) {
                    return res.status(200).json({ data: allData });
                }
                else {
                    return res.status(400).json('faild.');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    addCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = req.body.name;
                const allCategory = yield this.useCase.addCategory(name);
                if ((allCategory === null || allCategory === void 0 ? void 0 : allCategory.status) == 200) {
                    res.status(200).json(allCategory.data);
                }
                else {
                    res.status(allCategory.status).json(allCategory.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    allCategorydata(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCategory = yield this.useCase.allCategory();
                if ((allCategory === null || allCategory === void 0 ? void 0 : allCategory.status) == 200) {
                    res.status(200).json(allCategory.data);
                }
                else {
                    res.status(allCategory.status).json(allCategory.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    blockCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const categoryData = yield this.useCase.blockCategory(id);
                if ((categoryData === null || categoryData === void 0 ? void 0 : categoryData.status) == 200) {
                    res.status(200).json(categoryData.data);
                }
                else {
                    res.status(categoryData.status).json(categoryData.message);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = req.body.data;
                const data = req.query.id;
                // console.log(234,data);
                if (admin == 'admin') {
                    res.clearCookie('AdminRefreshToken');
                    res.clearCookie('AdminAccessToken');
                    return res.status(200).json('success');
                }
                return res.status(400).json('faild.');
            }
            catch (error) {
                next(error);
            }
        });
    }
    editCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.useCase.editCatagory(req);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    degeteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.useCase.deleteCategory(req.query.id);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    takeAlljobs(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.useCase.takeAllJob();
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
    blockJob(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.useCase.blockJob(req.body.id);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AdminController;
