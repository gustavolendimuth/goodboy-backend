/* eslint-disable @typescript-eslint/no-explicit-any */
import ItemsModel from '../database/models/ItemsModel';
import OrderModel from '../database/models/OrderModel';
import UserModel from '../database/models/UserModel';
import { Order } from '../interfaces';

export const createOrder = async (body:Order) => OrderModel.create({ ...body }, {
  include: [ItemsModel, UserModel],
});

export const updateOrder = async (body:{ data:Order, id?:string, paymentId?:number }) => {
  const { data, id, paymentId } = body;

  return OrderModel.update(data, { where: id ? { id } : { paymentId } });
};

export const getOrder = async (body:{ id?:string, paymentId?:number }) => {
  const { paymentId, id } = body;
  return OrderModel.findOne({ where: id ? { id } : { paymentId } });
};

export const getOrders = async (body: Order) => OrderModel.findAll({
  attributes: { exclude: ['userId'] },
  where: { userId: body.login?.data.id },
  include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
});

export const deleteOrder = async (id:string) => OrderModel.destroy({ where: { id } });
