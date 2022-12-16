import { Request, Response } from "express";
import * as orderService from "../services/orders.service";

export const getAllOrders = async (req: Request, res: Response) => {
  const response = await orderService.getAllOrders();
  res.status(200).json(response);
}
