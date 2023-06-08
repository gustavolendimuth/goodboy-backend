/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { getOrderService } from './orderService';
import { Order } from '../interfaces';
import OrderModel from '../database/models/OrderModel';

async function updateOrderAddress(order: OrderModel, orderData: Partial<Order>) {
  const { address, number, complement, neighborhood, city, state, postalCode } = orderData;
  const userAddress = { address, number, complement, neighborhood, city, state, postalCode };
  order.set(orderData);
  order.user.set(userAddress);
  await order.save();
  await order.user.save();
  return order;
}

async function updateUser(order: OrderModel, data: { name?:string, cpf?:string }) {
  order.user.name = data.name;
  if (data.cpf) order.user.cpf = data.cpf;
  await order.user.save();
  return order;
}

export async function tinyOrderService(body:Order) {
  const { paymentId, name, cpf, ...orderData } = body;
  if (!paymentId) return new Error('PaymentId is required');

  // Get Order
  let order = await getOrderService({ paymentId: paymentId.toString() });
  if (!order) return new Error('Order not found');
  if (order.status !== 'approved') return;

  // Update order address
  if (Object.keys(orderData).length) order = await updateOrderAddress(order, orderData);

  // Update user name if exists
  if (name || cpf) order = await updateUser(order, { name, cpf });
}
