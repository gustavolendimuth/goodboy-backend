import { Request, Response } from 'express';
import loginService from '../services/login.service';

const login = async (req: Request, res: Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { body } = req;
  const response = await loginService(body);

  res.status(200).json(response);
};

export default login;