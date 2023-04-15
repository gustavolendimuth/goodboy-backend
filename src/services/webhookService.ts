/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { WebhookBody } from '../interfaces';
import createOrderWebhook from '../utils/createOrderWebhook';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import { createOrderService, getOrderService, updateOrderService } from './orderService';

export const webhookService = async (body:WebhookBody) => {
  console.log('webhook', body);
  try {
    if (body.action === 'payment.updated') {
      const response = await fetchPayment.get(body.data.id);
      const order = await getOrderService({ paymentId: response.data.id });
      const orderData = await createOrderWebhook({ orderData: response.data });

      if (!order) {
        await createOrderService(orderData);
        return { message: 'order created' };
      }
      await updateOrderService({ data: orderData, paymentId: response.data.id });
      return { message: 'order updated' };
    }

    return { message: 'nothing to update' };
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao atualizar pedido');
  }
};
