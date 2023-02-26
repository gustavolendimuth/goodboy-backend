/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { v4 as uuidv4 } from 'uuid';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import { createOrderIpn } from '../utils/processPaymentUtils';
import { createOrder, getOrder, updateOrder } from './orderService';

export const ipn = async (id:string, topic:string) => {
  try {
    if (topic === 'payment') {
      const payment = await fetchPayment.get(id);
      const order = await getOrder({ paymentId: Number(id) });
      const orderData = await createOrderIpn({ orderData: payment.data, id: !order ? uuidv4() : undefined });

      if (order) {
        await updateOrder({ data: orderData, paymentId: Number(id) });
        return { message: 'order updated' };
      }

      await createOrder(orderData);
      return { message: 'order created' };
    }
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao criar o pedido');
  }

  return { message: 'nothing to update' };
};
