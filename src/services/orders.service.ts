import ItemsModel from '../database/models/ItemsModel';
import OrderModel from "../database/models/OrderModel";
import { IError } from "../interfaces";
// import { validateOrder } from './validations/order.validation';

export const getAllOrders = async () => {
  const response = await OrderModel.findAll({
    attributes: { exclude: ['userId'] },
    include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
  });

  if (!response) {
    const err: IError = new Error("Order not found");
    err.statusCode = 401;
    throw err;
  }

  return response;
}
