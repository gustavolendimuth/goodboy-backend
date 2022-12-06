import { Op } from 'sequelize';
import UserModel from '../database/models/UserModel';
import { ILogin, IError } from '../interfaces';
import { createToken } from '../utils/jwtUtils';
import validateLogin from './validations/login.validation';

const login = async (body: ILogin) => {
  validateLogin(body);

  const { email, password } = body;

    const response = await UserModel.findOne({ 
    where: {
      [Op.and]: [
        { email },
        { password }
      ]
    }
  })
  
  if (!response) {
    const err:IError = new Error('invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const { password: p, createdAt, updatedAt, ...userWithoutPassword } = response.dataValues;
  const token = createToken(userWithoutPassword);
  return { token, data: userWithoutPassword };
};

export default login;