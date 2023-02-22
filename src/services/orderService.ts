/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from 'sequelize';
import ItemsModel from '../database/models/ItemsModel';
import OrderModel from '../database/models/OrderModel';
import UserModel from '../database/models/UserModel';
import { IOrder } from '../interfaces';

export const createOrder = async (body:IOrder) => OrderModel.create({ ...body }, {
  include: [ItemsModel, UserModel],
});

export const updateOrder = async (body:{ data:IOrder, id?:string, paymentId?:number }) => {
  const { data, id, paymentId } = body;
  return OrderModel.update(data, { where: {
    [Op.or]: [{ id }, { paymentId }],
  } });
};

export const getOrder = async (body:{ id?:string, preferenceId?:string }) => {
  const { id, preferenceId } = body;
  return OrderModel.findOne({ where: {
    [Op.or]: [{ id }, { preferenceId }],
  } });
};

export const getOrders = async (body: IOrder) => OrderModel.findAll({
  attributes: { exclude: ['userId'] },
  where: { userId: body.login?.data.id },
  include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
});

export const deleteOrder = async (id:string) => OrderModel.destroy({ where: { id } });
