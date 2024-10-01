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
class GraphUseCase {
    constructor(graphRepository) {
        this._graphRepository = graphRepository;
    }
    takeGraphData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._graphRepository.createGarphData();
            if (data) {
                return {
                    status: 200,
                    data: data
                };
            }
            return {
                status: 400,
                message: 'Failed to retrieve graph data. Please try again later or contact support if the issue persists.',
            };
        });
    }
}
exports.default = GraphUseCase;
