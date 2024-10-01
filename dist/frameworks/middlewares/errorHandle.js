"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRoute = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandle = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.isOperational
        ? err.message
        : 'An unexpected error occurred';
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};
const exampleRoute = (req, res, next) => {
    try {
        throw new AppError('This is a custom error message', 400);
    }
    catch (error) {
        next(error);
    }
};
exports.exampleRoute = exampleRoute;
exports.default = errorHandle;
