import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { IError, IUser } from '../interfaces';

export const createJwtToken = (data:IUser):string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET not found');

  const token = jwt.sign({ data }, jwtSecret, {
    expiresIn: '15d',
    algorithm: 'HS256',
  });

  return token;
};

export const validateJwtToken = (token: string) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not found');

    const response = jwt.verify(token, jwtSecret);

    return response;
  } catch (e) {
    const err: IError = new Error('Token inválido');
    err.statusCode = 401;
    throw err;
  }
};
