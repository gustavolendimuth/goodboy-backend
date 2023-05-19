/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { ipnService } from '../services/ipnService';

export const ipnController = async (req: Request, res:Response) => {
  const { query: { id: paymentId, topic } } = req as never;
  await ipnService(paymentId, topic);
  res.status(200);
};
