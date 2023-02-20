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
  if (paymentId) {
    return OrderModel.update(data, { where: { paymentId } });
  }
  return OrderModel.update(data, { where: { id } });
};

export const getOrder = async (body:IOrder, id:string) => OrderModel.findOne({
  where: {
    [Op.and]: [
      { userId: body.login?.data.id },
      { id },
    ],
  },
});

export const getOrders = async (body: IOrder) => OrderModel.findAll({
  attributes: { exclude: ['userId'] },
  where: { userId: body.login?.data.id },
  include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
});

export const deleteOrder = async (id:string) => OrderModel.destroy({ where: { id } });
