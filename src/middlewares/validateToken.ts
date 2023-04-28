import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/HttpException';

export const validateToken = (req:Request, _res:Response, next: NextFunction) => {
  const { token: frontEndToken } = req.headers;
  const token = process.env.TOKEN;

  if (!frontEndToken && token !== frontEndToken) {
    throw new HttpException(401, 'Token inválido');
  }

  next();
};

export default validateToken;
