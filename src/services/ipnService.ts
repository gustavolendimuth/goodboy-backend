/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { v4 as uuidv4 } from 'uuid';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/httpException';
import { createOrderData } from '../utils/processPaymentUtils';
import { createOrder } from './orderService';

export const ipn = async (id:string, topic:string) => {
  try {
    if (topic === 'payment') {
      const payment = await fetchPayment.get(id);
      const result = await createOrderData({ order: payment.data, email: payment?.data?.payer?.email, id: uuidv4() });
      console.log(result);
      await createOrder(result);
      return { message: 'order created' };
    }

    return { message: 'nothing to update' };
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao criar o pedido');
  }
};
