"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../../controller/adminController"));
const adminRepository_1 = __importDefault(require("../../repository/adminRepository"));
const adminUseCase_1 = __importDefault(require("../../usecase/adminUseCase"));
const errorHandle_1 = __importDefault(require("../middlewares/errorHandle"));
const bcryptPassword_1 = __importDefault(require("../utils/bcryptPassword"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const adminRouter = express_1.default.Router();
//services 
const encryptPassword = new bcryptPassword_1.default();
const jwtToken = new generateToken_1.default();
//repositories
const adminRepository = new adminRepository_1.default();
//useCases
const adminUseCase = new adminUseCase_1.default(adminRepository, encryptPassword, jwtToken);
const adminMiddlewares_1 = __importDefault(require("../middlewares/adminMiddlewares"));
const adminController = new adminController_1.default(adminUseCase);
adminRouter.post('/login', (req, res, next) => {
    adminController.login(req, res, next);
});
adminRouter.get('/getUserData', adminMiddlewares_1.default, (req, res, next) => {
    adminController.findAllUsers(req, res, next);
});
adminRouter.patch('/UserBlocking', adminMiddlewares_1.default, (req, res, next) => {
    adminController.blockUser(req, res, next);
});
adminRouter.post('/addCategory', adminMiddlewares_1.default, (req, res, next) => {
    adminController.addCategory(req, res, next);
});
adminRouter.get('/allCategory', adminMiddlewares_1.default, (req, res, next) => {
    adminController.allCategorydata(req, res, next);
});
adminRouter.patch('/categoryBlocking', adminMiddlewares_1.default, (req, res, next) => {
    adminController.blockCategory(req, res, next);
});
adminRouter.post('/logout', (req, res, next) => {
    adminController.logout(req, res, next);
});
adminRouter.patch('/editCategory', adminMiddlewares_1.default, (req, res, next) => {
    adminController.editCategory(req, res, next);
});
adminRouter.delete('/deleteCategory', adminMiddlewares_1.default, (req, res, next) => {
    adminController.degeteCategory(req, res, next);
});
adminRouter.get('/allJobs', adminMiddlewares_1.default, (req, res, next) => {
    adminController.takeAlljobs(req, res, next);
});
adminRouter.patch('/blockJob', adminMiddlewares_1.default, (req, res, next) => {
    adminController.blockJob(req, res, next);
});
adminRouter.use(errorHandle_1.default);
exports.default = adminRouter;
