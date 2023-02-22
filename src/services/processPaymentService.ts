/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

import { v4 as uuidv4 } from 'uuid';
import { createOrder, updateOrder } from './orderService';
import { ProcessPaymentBody } from '../interfaces';
import { validateOrder } from './validations/orderValidation';
import HttpException from '../utils/httpException';
import errorLog from '../utils/errorLog';
import { createOrderData, mercadopagoSave } from '../utils/processPaymentUtils';

export const processPayment = async (body:ProcessPaymentBody) => {
  const orderId = uuidv4();
  const { formData, items } = body;
  const { payer: { email } } = formData;
  let orderData;
  let response;

  orderData = await createOrderData({ orderData: formData, items, email, id: orderId });
  validateOrder(orderData);
  await createOrder(orderData);

  try {
    response = (await mercadopagoSave(formData)).response;
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao processar o pagamento no Mercado Pago, tente mais tarde');
  }

  try {
    orderData = await createOrderData({ orderData: response, items, email });
    validateOrder(orderData);
    updateOrder({ data: orderData, id: orderId });
    // if (response.status === '') await deleteOrder(orderId);
    return response;
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao criar o pedido, tente mais tarde');
  }
};
