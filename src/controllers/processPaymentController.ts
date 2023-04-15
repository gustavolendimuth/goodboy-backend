/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import processPaymentService from '../services/processPaymentService';

export const processPayment = async (req: Request, res:Response) => {
  const { body } = req as never;
  const response = await processPaymentService(body);
  res.status(201).json({
    status: response.status,
    id: response.paymentId,
  });
};
