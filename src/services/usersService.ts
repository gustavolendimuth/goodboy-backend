/* eslint-disable import/prefer-default-export */
import UserModel from '../database/models/UserModel';
import { GetUser, IUser } from '../interfaces';

export const getUser = async (body: GetUser) => {
  const { email, id } = body;
  const response = await UserModel.findOne({
    where: id ? { id } : { email },
  });
  return response;
};

export const updateUser = async (body: IUser) => {
  const { email, id } = body;
  const response = await UserModel.update(body, {
    where: id ? { id } : { email },
  });
  return response;
};

// export const createUser = async (body:IUser) => {
//   validateUser(body);

//   const response = await UserModel.create({ ...body }, { fields: ['email', 'name', 'password'] });

//   const { password: p, createdAt, updatedAt, ...userWithoutPassword } = response.dataValues;
//   const token = createToken(userWithoutPassword);

//   return { token, dataValues: userWithoutPassword };
// };
