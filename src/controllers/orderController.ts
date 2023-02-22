import { Request, Response } from 'express';
import * as orderService from '../services/orderService';

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await orderService.getOrder({ paymentId: Number(id) });
  res.status(200).json(response);
};

export const createOrder = async (req: Request, res: Response) => {
  const response = await orderService.createOrder(req.body);
  res.status(200).json(response);
};

export const getOrders = async (req: Request, res: Response) => {
  const response = await orderService.getOrders(req.body);
  res.status(200).json(response);
};
