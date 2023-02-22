/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/httpException';
import { createOrderData } from '../utils/processPaymentUtils';
import { createOrder } from './orderService';

export const ipn = async (id:string, topic:string) => {
  console.log(topic, id);

  try {
    // if (topic === 'payment') {
    //   const response = await fetchPayment.get(id);

    //   const result = await createOrderData({ order: response.data, email: response?.data?.payer?.email });
    //   const order = await updateOrder({ data: result, paymentId: response.data.id });
    //   console.log('payment', response, result, order);
    //   return { message: 'order updated' };
    // }

    if (topic === 'payment') {
      // const response = await fetchOrder.get(id);

      const payment = await fetchPayment.get(id);
      const result = await createOrderData({ order: payment.data, email: payment?.data?.payer?.email });
      console.log(payment, result);
      await createOrder(result);
      return { message: 'order created' };
    }

    return { message: 'nothing to update' };
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao atualizar pedido');
  }
};
