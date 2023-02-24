/* eslint-disable import/prefer-default-export */
import ItemsModel from '../database/models/ItemsModel';
import OrderModel from '../database/models/OrderModel';
import errorLog from '../utils/errorLog';
import HttpException from '../utils/HttpException';

export const getAllOrders = async () => {
  const response = await OrderModel.findAll({
    attributes: { exclude: ['userId'] },
    include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
  });

  if (!response) {
    const err = new HttpException(404, 'Nenhum pedido encontrado');
    errorLog(err);
    throw err;
  }

  return response;
};
