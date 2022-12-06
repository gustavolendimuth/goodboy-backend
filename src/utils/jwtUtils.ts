import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { IError, IUser } from '../interfaces';

export const createToken = (data:IUser):string => {
  const jwtSecret = 'secret';
  const token = jwt.sign({ data }, jwtSecret, {
    // expiresIn: '15d',
    algorithm: 'HS256',
  });

  return token;
};

export const validateToken = (token: string) => {
  try {
    const jwtSecret = 'secret';
    const response = jwt.verify(token, jwtSecret);
    
    return response;
  } catch (e) {
    const err: IError = new Error('Invalid token');
    err.statusCode = 401;
    throw err;
  }
};
