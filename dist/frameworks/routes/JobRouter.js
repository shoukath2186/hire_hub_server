"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandle_1 = __importDefault(require("../middlewares/errorHandle"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const multer_1 = __importDefault(require("multer"));
const jobController_1 = __importDefault(require("../../controller/jobController"));
const jobUseCase_1 = __importDefault(require("../../usecase/jobUseCase"));
const jobRepository_1 = __importDefault(require("../../repository/jobRepository"));
const multer_2 = __importDefault(require("../middlewares/multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const upload = (0, multer_1.default)({ storage: multer_2.default });
const jobRepository = new jobRepository_1.default();
const cloudinary = new cloudinary_1.default();
const jobUseCase = new jobUseCase_1.default(jobRepository, cloudinary);
const jobController = new jobController_1.default(jobUseCase);
const jobRouter = express_1.default.Router();
jobRouter.get('/allCalegory', authMiddleware_1.default, (req, res, next) => {
    jobController.getAllCategory(req, res, next);
});
jobRouter.post('/addNewJob', authMiddleware_1.default, upload.single('logo'), (req, res, next) => {
    jobController.createJob(req, res, next);
});
jobRouter.get('/getjobs', authMiddleware_1.default, (req, res, next) => {
    jobController.getEmployerJob(req, res, next);
});
jobRouter.put('/deleteJob', authMiddleware_1.default, (req, res, next) => {
    jobController.delereJob(req, res, next);
});
jobRouter.patch('/UpdateJob', authMiddleware_1.default, upload.single('logo'), (req, res, next) => {
    jobController.updateJobData(req, res, next);
});
jobRouter.get('/homeJob', (req, res, next) => {
    jobController.takeJob(req, res, next);
});
jobRouter.get('/getJob', authMiddleware_1.default, (req, res, next) => {
    jobController.getJob(req, res, next);
});
jobRouter.get('/allLocation', authMiddleware_1.default, (req, res, next) => {
    jobController.allLocation(req, res, next);
});
jobRouter.get('/search', authMiddleware_1.default, (req, res, next) => {
    jobController.searchJob(req, res, next);
});
jobRouter.post('/newApplication', authMiddleware_1.default, (req, res, next) => {
    jobController.createApplication(req, res, next);
});
jobRouter.get('/checkApplicationExists', authMiddleware_1.default, (req, res, next) => {
    jobController.checkExists(req, res, next);
});
jobRouter.get('/applications', authMiddleware_1.default, (req, res, next) => {
    jobController.jobApplications(req, res, next);
});
jobRouter.patch('/updateStatus', authMiddleware_1.default, (req, res, next) => {
    jobController.updateStatus(req, res, next);
});
jobRouter.get('/applicantProfile', authMiddleware_1.default, (req, res, next) => {
    jobController.getProfile(req, res, next);
});
jobRouter.use(errorHandle_1.default);
exports.default = jobRouter;
