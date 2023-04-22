import { NextFunction, Request, Response } from 'express';
import { validateJwtToken } from '../utils/jwtUtils';
import HttpException from '../utils/HttpException';

export default (req: Request, _res:Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new HttpException(401, 'Você precisa estar logado para acessar essa rota');
  }
  req.body.login = validateJwtToken(authorization);

  next();
};
