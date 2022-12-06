import { Request, Response } from "express";
import * as processPaymentService from '../services/process.payment.service';
import { IProcessPayment } from '../interfaces';

export const processPayment = async (req: Request, res:Response) => {
  const { body } = req as never;
  const response:IProcessPayment = await processPaymentService.processPayment(body);
  res.status(201).json({
    detail: response.status_detail,
    status: response.status,
    id: response.id
  });
};
