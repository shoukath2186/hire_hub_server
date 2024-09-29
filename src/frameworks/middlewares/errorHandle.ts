
import { Request, Response, NextFunction } from "express";


class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandle = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
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


const exampleRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new AppError('This is a custom error message', 400);
  } catch (error) {
    next(error);
  }
};

export default errorHandle;
export { AppError, exampleRoute };