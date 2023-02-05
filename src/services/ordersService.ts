import ItemsModel from '../database/models/ItemsModel';
import OrderModel from "../database/models/OrderModel";
import HttpException from '../utils/httpException';

export const getAllOrders = async () => {
  const response = await OrderModel.findAll({
    attributes: { exclude: ['userId'] },
    include: [{ model: ItemsModel, attributes: { exclude: ['id', 'orderId'] } }],
  });

  if (!response) {
    const err = new HttpException(404, 'Nenhum pedido encontrado');
    console.log(err);
    throw err;
  }

  return response;
}
