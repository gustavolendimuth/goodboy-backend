/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import * as ipnService from '../services/ipnService';

export const ipn = async (req: Request, res:Response) => {
  const { query: { id, topic } } = req as never;
  const response = await ipnService.ipn(id, topic);
  res.status(200).json(response);
};
