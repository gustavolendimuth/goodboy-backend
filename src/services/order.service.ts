import { Op } from 'sequelize';
import ItemsModel from '../database/models/ItemsModel';
import OrderModel from "../database/models/OrderModel";
import UserModel from '../database/models/UserModel';
import { IError, IOrder } from "../interfaces";
import { validateOrder } from './validations/order.validation';

export const createOrder = async (body:IOrder) => {
  console.log(body);
  
  validateOrder(body);
  const response = await OrderModel.create({...body}, {
    include: [ItemsModel, UserModel]
  });

  if (!response) {
    const err: IError = new Error("Order not created");
    err.statusCode = 401;
    throw err;
  }

  return response;
}

export const getOrder = async (body:IOrder, id:string) => {
  const response = await OrderModel.findOne({
    where: {
      [Op.and]: [
      {userId: body.login?.data.id },
      { id: id }
      ]
    },
  });

  if (!response) {
    const err: IError = new Error("Order not found");
    err.statusCode = 401;
    throw err;
  }

  return response;
}

export const getOrders = async (body: IOrder) => {
  const response = await OrderModel.findAll({
    attributes: { exclude: ['userId'] },
    where: { userId: body.login?.data.id },
    include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
  });

  if (!response) {
    const err: IError = new Error("Order not found");
    err.statusCode = 401;
    throw err;
  }

  return response;
}