import { Request, Response } from 'express';
import preferenceService from '../services/preferenceService';

const preferenceController = async (req: Request, res: Response) => {
  const { body } = req;
  const response = await preferenceService(body);

  res.status(200).json(response);
};

export default preferenceController;