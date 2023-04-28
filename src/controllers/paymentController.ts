/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';

export const paymentController = async (req:Request, res:Response) => {
  const { paymentId } = req.params;
  const response = await paymentService(paymentId);
  res.status(200).json(response);
};
