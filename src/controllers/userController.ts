/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import * as userService from '../services/usersService';

export const getUser = async (req:Request, res:Response) => {
  const response = await userService.getUser(req.body.user.data);
  res.status(200).json(response);
};

// export const createUser = async (req:Request, res:Response) => {
//   const response = await userService.createUser(req.body);
//   res.status(200).json(response);
// };
