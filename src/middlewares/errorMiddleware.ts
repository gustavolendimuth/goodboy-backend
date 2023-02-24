/* eslint-disable import/prefer-default-export */
import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/HttpException';

export const errorMiddleware = (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode, message } = err;
  return res.status(statusCode || 500).json({ message });
};
