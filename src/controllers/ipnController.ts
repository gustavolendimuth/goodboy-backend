/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { ipnService } from '../services/ipnService';

export const ipnController = async (req: Request, res:Response) => {
  const { query: { id, topic } } = req as never;
  const response = await ipnService(id, topic);
  res.status(response.status || 200).json(response.message || response);
};
