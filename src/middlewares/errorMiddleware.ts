import { Request, Response, NextFunction } from 'express';
import errorLog from '../utils/errorLog';
import HttpException from '../utils/httpException';

export const errorMiddleware = (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode, message, stack } = err;

  errorLog(
    JSON.stringify(
      `<h1>${statusCode}</h1><h2>${message}</h2><p>${stack?.replace(/\n/g, "<br />")}</p>`
      )
  );

  return res.status(statusCode || 500).json({ message });
};