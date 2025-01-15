/* eslint-disable @typescript-eslint/no-explicit-any */
import ItemsModel from '../database/models/ItemsModel';
import OrderModel from '../database/models/OrderModel';
import UserModel from '../database/models/UserModel';
import { Order } from '../interfaces';

export const createOrderService = async (order:Order) => OrderModel.create({ ...order }, {
  include: [{ model: UserModel, as: 'user' }, { model: ItemsModel, as: 'items' }],
});

export const updateOrderService = async (body:{ data:Order, id?:string, paymentId?:number }) => {
  const { data, id, paymentId } = body;
  const where = id ? { id } : { paymentId: String(paymentId) };
  
  return OrderModel.update(data, { where });
};

export const getOrderService = async (body:{ id?:string, paymentId?:string }) => {
  const { paymentId, id } = body;
  const where = id ? { id } : { paymentId: String(paymentId) };
  
  return OrderModel.findOne({
    where,
    include: [
      {
        model: ItemsModel,
        as: 'items',
        attributes: {
          exclude: ['orderId'],
        },
      },
      {
        model: UserModel,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'magicLink', 'magicLinkExpired'],
        },
      },
    ],
    attributes: { exclude: ['userId'] },
  });
};

export const getOrdersService = async (userId:string) => OrderModel.findAll({
  attributes: { exclude: ['userId'] },
  where: { userId },
  include: [{ model: ItemsModel, as: 'items', attributes: { exclude: ['orderId'] } }],
});

export const deleteOrder = async (id:string) => OrderModel.destroy({ where: { id } });
