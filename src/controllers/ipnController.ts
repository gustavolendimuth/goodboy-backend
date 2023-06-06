/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { ipnService } from '../services/ipnService';

export const ipnController = async (req: Request, res:Response) => {
  const { query: { id: paymentId, topic } } = req;
  if (typeof paymentId !== 'string' || typeof topic !== 'string') {
    return res.status(400).send('Invalid query parameters');
  }

  await ipnService(paymentId, topic);
  return res.status(200).send();
};
