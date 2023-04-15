import { CreateOrderDataParams } from '../interfaces';
import HttpException from './HttpException';
import OrderClass from './OrderClass';

export default async ({ orderData }:CreateOrderDataParams) => {
  const userEmail = orderData?.payer?.email;
  if (!userEmail) throw new HttpException(400, 'email missing');

  const { user, ...order } = new OrderClass({ orderData });
  return order;
};
