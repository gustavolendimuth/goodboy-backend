import { Request, Response } from 'express';
import loginService from '../services/loginService';

const login = async (req: Request, res: Response) => {
  const { body } = req;
  const response = await loginService(body);

  res.status(200).json(response);
};

export default login;