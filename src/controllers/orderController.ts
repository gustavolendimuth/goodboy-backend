import { Request, Response } from 'express';
import { getOrderService, getOrdersService, createOrderService } from '../services/orderService';

export const getOrder = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  const { id } = req.body;
  const response = await getOrderService({ paymentId, id });
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
