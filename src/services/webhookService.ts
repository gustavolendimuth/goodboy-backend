/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { WebhookBody } from '../interfaces';
import createOrderWebhook from '../utils/createOrderWebhook';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import { createOrderService, getOrderService, updateOrderService } from './orderService';

export const webhookService = async (body: WebhookBody) => {
  let response;
  let order;
  let orderData;

  try {
    response = await fetchPayment.get(body.data.id);
    order = await getOrderService({ paymentId: response.data.id });
    
    orderData = await createOrderWebhook({ orderData: response.data });
    if (!orderData) {
      throw new HttpException(400, 'Failed to create order data');
    }

    if (!order) {
      await createOrderService(orderData);
      return;
    }

    await updateOrderService({ data: orderData, paymentId: response.data.id });
  } catch (error: any) {
    errorLog({ error, variables: JSON.stringify({ response, order, orderData, body }) });
    throw new HttpException(error.status || 400, error.message || 'Webhook service error');
  }
};
