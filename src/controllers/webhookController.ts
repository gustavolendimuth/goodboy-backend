/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { webhookService } from '../services/webhookService';

export const webhookController = async (req: Request, res:Response) => {
  const { body } = req;
  await webhookService(body);
  return res.status(200).send();
};
