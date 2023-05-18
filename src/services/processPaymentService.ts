/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { createOrderService, getOrderService } from './orderService';
import { CreateOrderParams } from '../interfaces';
import { validateOrder } from './validations/orderValidation';
import HttpException from '../utils/HttpException';
import errorLog from '../utils/errorLog';
import createOrderData from '../utils/createOrderData';
import mercadopagoSave from '../utils/mercadopagoSave';
import { tinyOrderService } from './tinyOrderService';

const emailValidation = z
  .string()
  .email()
  .trim()
  .max(32)
  .min(1);

async function createOrder(body: CreateOrderParams) {
  const { formData, items, orderData } = body;

  if (!formData || !items) {
    throw new Error('There was no data to create the order');
  }

  const { payer: { email } } = formData;
  const userEmail = emailValidation.parse(email);

  const order = await createOrderData({ formData, orderData, items, email: userEmail });
  validateOrder(order);
  const response = await createOrderService(order);
  const result = await getOrderService({ id: response.id?.toString() });

  return result;
}

async function processMercadopagoPayment(formData:CreatePaymentPayload) {
  const { response } = await mercadopagoSave(formData);
  if (!response) throw new Error('Error processing Mercado Pago payment, please try again later');

  return response;
}

export default async function processPayment(body: CreateOrderParams) {
  let orderData;
  let order;
  try {
    if (!body.formData) {
      throw new Error('There was no formData to create the order');
    }
    orderData = await processMercadopagoPayment(body.formData);
    order = await createOrder({ ...body, orderData });
    const { error } = await tinyOrderService({ paymentId: orderData.id });
    if (error) throw new Error('Error creating tiny order');
    return order;
  } catch (error: any) {
    errorLog({ error, variables: { order, orderData, body } });
    throw new HttpException(400, 'Erro ao criar o pedido, tente novamente mais tarde');
  }
}
