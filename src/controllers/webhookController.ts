/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { webhookService } from '../services/webhookService';

export const webhookController = async (req: Request, res:Response) => {
  const { body } = req as never;
  const response = await webhookService(body);
  res.status(200).json(response);
};
