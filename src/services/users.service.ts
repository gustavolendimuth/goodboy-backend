import { Op } from 'sequelize';
import UserModel from '../database/models/UserModel';
import { IError, IGetUser, IUser } from '../interfaces';
import { createToken } from '../utils/jwtUtils';
import validateUser from './validations/users.validation';

export const getUser = async (body: IGetUser) => {
  const { email } = body;
  const response = await UserModel.findOne({ 
    where: { email }
  })

  if (!response) {
    const err:IError = new Error('User not found');
    err.statusCode = 401;
  }

  return response;
};

export const createUser = async (body:IUser) => {
  validateUser(body);
  
  const response = await UserModel.create({ ...body },  { fields: ['email', 'name', 'password'] })
  
  const { password: p, createdAt, updatedAt, ...userWithoutPassword } = response.dataValues;
  const token = createToken(userWithoutPassword);

  return { token,  dataValues: userWithoutPassword };
};
