/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { tinyOrderService } from '../services/tinyOrderService';

export const tinyOrderController = async (req:Request, res:Response) => {
  const { body } = req;

  const response = await tinyOrderService(body);

  res.status(201).send({ response });
};
