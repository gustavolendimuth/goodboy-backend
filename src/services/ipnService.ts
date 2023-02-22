/* eslint-disable import/prefer-default-export */
import { fetchOrder, fetchPayment } from '../utils/fetchMercadoPago';
import { createOrderData } from '../utils/processPaymentUtils';
import testeLog from '../utils/testeLog';
import { createOrder, updateOrder } from './orderService';

export const ipn = async (id:string, topic:string) => {
  if (topic === 'payment') {
    const response = await fetchPayment.get(id);

    const result = await createOrderData({ order: response.data, email: response?.data?.payer?.email });
    const order = await updateOrder({ data: result, paymentId: response.data.id });
    testeLog(order);
    return { message: 'order updated' };
  }

  if (topic === 'merchant_order') {
    const response = await fetchOrder.get(id);

    const payment = await fetchPayment.get(response.data.payments[0].id);
    const result = await createOrderData({ order: payment.data, email: payment?.data?.payer?.email });
    testeLog(result);
    await createOrder(result);
    return { message: 'order created' };
  }

  return { message: 'nothing to update' };
};
