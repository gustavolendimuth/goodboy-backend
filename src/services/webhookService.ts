/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { WebhookBody } from '../interfaces';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import { createOrderWebhook } from '../utils/processPaymentUtils';
import { updateOrder } from './orderService';

export const webhook = async (body:WebhookBody) => {
  try {
    if (body.action === 'payment.updated') {
      const response = await fetchPayment.get(body.data.id);

      const result = await createOrderWebhook({ orderData: response.data });
      await updateOrder({ data: result, paymentId: response.data.id });
      return { message: 'order updated' };
    }

    return { message: 'nothing to update' };
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao atualizar pedido');
  }
};
