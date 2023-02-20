/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { WebhookBody } from '../interfaces';
import { createOrderData } from '../utils/processPaymentUtils';
import testeLog from '../utils/testeLog';
import { updateOrder } from './orderService';

export const webhook = async (body:WebhookBody) => {
  const http = axios.create({
    baseURL: 'https://api.mercadopago.com/v1/payments',
    headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
  });

  if (body.action === 'payment.updated') {
    const response:any = await http.get(body.data.id);
    const result = await createOrderData(response);
    const order = updateOrder({ data: result, paymentId: response.id });
    testeLog({ body, response, order });
    return { message: 'updated' };
  }
  return { message: 'nothing to update' };
};
