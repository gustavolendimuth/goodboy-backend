/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { v4 as uuidv4 } from 'uuid';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/httpException';
import { createOrderData } from '../utils/processPaymentUtils';
import { createOrder, getOrder, updateOrder } from './orderService';

export const ipn = async (id:string, topic:string) => {
  console.log(id, topic);

  try {
    if (topic === 'payment') {
      const payment = await fetchPayment.get(id);

      const orderData = await createOrderData({
        orderData: payment.data,
        email: payment?.data?.payer?.email,
        id: uuidv4(),
      });

      if (await getOrder({ paymentId: Number(id) })) {
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
