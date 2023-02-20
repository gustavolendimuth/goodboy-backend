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
    baseURL: 'https://api.mercadopago.com/v1/payments/',
    headers: { Authorization: 'Bearer APP_USR-1298546889623196-111715-e6180332ba5b528fa150a8da6c9376cd-83776232' },
  });

  if (body.action === 'payment.updated') {
    const response:any = await http.get(body.data.id);

    const result = await createOrderData({ order: response.data, email: response?.data?.payer?.email });
    const order = await updateOrder({ data: result, paymentId: response.data.id });
    testeLog(order);
    return { message: 'updated' };
  }
  return { message: 'nothing to update' };
};
