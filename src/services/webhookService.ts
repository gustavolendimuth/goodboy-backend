/* eslint-disable import/prefer-default-export */
import { WebhookBody } from '../interfaces';
import { fetchPayment } from '../utils/fetchMercadoPago';
import { createOrderData } from '../utils/processPaymentUtils';
import testeLog from '../utils/testeLog';
import { updateOrder } from './orderService';

export const webhook = async (body:WebhookBody) => {
  testeLog(body);

  if (body.action === 'payment.updated') {
    const response = await fetchPayment.get(body.data.id);

    const result = await createOrderData({ order: response.data, email: response?.data?.payer?.email });
    testeLog(result);
    await updateOrder({ data: result, paymentId: response.data.id });
    return { message: 'order updated' };
  }

  return { message: 'nothing to update' };
};
