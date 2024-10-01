"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandle_1 = __importDefault(require("../middlewares/errorHandle"));
const adminMiddlewares_1 = __importDefault(require("../middlewares/adminMiddlewares"));
const graphController_1 = __importDefault(require("../../controller/graphController"));
const graphUseCase_1 = __importDefault(require("../../usecase/graphUseCase"));
const graphRepository_1 = __importDefault(require("../../repository/graphRepository"));
const graphRepository = new graphRepository_1.default();
const graphUseCase = new graphUseCase_1.default(graphRepository);
const graphController = new graphController_1.default(graphUseCase);
const graphRouter = express_1.default.Router();
graphRouter.get('/', adminMiddlewares_1.default, (req, res, next) => {
    graphController.getGraphData(req, res, next);
});
graphRouter.use(errorHandle_1.default);
exports.default = graphRouter;
