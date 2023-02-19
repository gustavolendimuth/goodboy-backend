/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import * as webhookService from '../services/webhookService';

export const webhook = async (req: Request, res:Response) => {
  const { body } = req as never;
  const response = await webhookService.webhook(body);
  res.status(200).json(response);
};
