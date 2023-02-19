import { Request, Response } from 'express';
import * as processPaymentService from '../services/processPaymentService';

export const processPayment = async (req: Request, res:Response) => {
  const { body } = req as never;
  const response = await processPaymentService.processPayment(body);
  res.status(201).json({
    detail: response.status_detail,
    status: response.status,
    id: response.id,
  });
};

export const processPaymentUpdate = async (req: Request, res:Response) => {
  const { body } = req as never;
  await processPaymentService.processPaymentUpdate(body);
  res.status(201);
};
