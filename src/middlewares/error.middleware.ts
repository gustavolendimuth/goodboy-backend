import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/http.exception';

export default (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode, message } = err as HttpException;
  console.log(err);

  return res.status(statusCode || 500).json({ message });
};