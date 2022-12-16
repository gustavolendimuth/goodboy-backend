import { NextFunction, Request, Response } from 'express';
import { IError } from '../interfaces';
// import { getUser } from '../services/users.service';
import * as jwtUtils from '../utils/jwtUtils';

export default async (req: Request, _res:Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    const err:IError = new Error('Você precisa estar logado para acessar essa rota');
    err.statusCode = 401;
    throw err;
  }
  req.body.login = jwtUtils.validateToken(authorization);
  console.log(req.body.login);
  
  // await getUser(req.body.login.data);

  next();
};