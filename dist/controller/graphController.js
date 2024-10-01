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
class GraphController {
    constructor(graphUseCase) {
        this._graphUseCase = graphUseCase;
    }
    getGraphData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._graphUseCase.takeGraphData();
                if (response.status == 200) {
                    res.status(200).json(response.data);
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
}
exports.default = GraphController;
