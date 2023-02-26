/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { createOrder, updateOrder } from './orderService';
import { CreateOrderParams } from '../interfaces';
import { validateOrder } from './validations/orderValidation';
import HttpException from '../utils/HttpException';
import errorLog from '../utils/errorLog';
import { createOrderData, mercadopagoSave } from '../utils/processPaymentUtils';

export const processPayment = async (body:CreateOrderParams) => {
  let order;
  let response;
  let userEmail;
  const id = uuidv4();

  const emailValidation = z.string().email().trim()
    .max(32)
    .min(1);

  const { formData, items } = body;
  if (!formData) throw new HttpException(400, 'Erro ao processar o pagamento, tente mais tarde');

  const { payer: { email } } = formData;

  try {
    userEmail = emailValidation.parse(email);
    order = await createOrderData({ formData, items, email: userEmail, id });
    validateOrder(order);
    await createOrder(order);
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao criar o pedido, tente mais tarde');
  }

  try {
    response = (await mercadopagoSave(formData)).response;
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao processar o pagamento no Mercado Pago, tente mais tarde');
  }

  try {
    order = await createOrderData({ orderData: response, items, email: userEmail });
    validateOrder(order);
    updateOrder({ data: order, id });
    return response;
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao criar o pedido, tente mais tarde');
  }
};
