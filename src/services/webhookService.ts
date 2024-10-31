/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { WebhookBody } from '../interfaces';
import createOrderWebhook from '../utils/createOrderWebhook';
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import { createOrderService, getOrderService, updateOrderService } from './orderService';

export const webhookService = async (body:WebhookBody) => {
  let response;
  let order;
  let orderData;

  try {
    // Get payment data from mercado pago and get order data
    response = await fetchPayment.get(body.data.id);
    order = await getOrderService({ paymentId: response.data.id });
    if (!order) return;

    // Create order object
    orderData = await createOrderWebhook({ orderData: response.data });
    if (!orderData) return;

    // Create order if It doesn't exists
    if (!order) {
      await createOrderService(orderData);
      return;
    }

    // Update order if exists
    await updateOrderService({ data: orderData, paymentId: response.data.id });
  } catch (error:any) {
    errorLog({ error, variables: JSON.stringify({ response, order, orderData, body }) });
    throw new HttpException(400, 'Webhook service error');
  }
};
