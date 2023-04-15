import { Request, Response } from 'express';
import { getOrderService, getOrdersService, createOrderService } from '../services/orderService';

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await getOrderService({ paymentId: Number(id) });
  res.status(200).json(response);
};

export const createOrder = async (req: Request, res: Response) => {
  const response = await createOrderService(req.body);
  res.status(200).json(response);
};

export const getOrders = async (req: Request, res: Response) => {
  const response = await getOrdersService(req.body);
  res.status(200).json(response);
};
