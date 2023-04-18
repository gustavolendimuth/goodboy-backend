/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { createOrderService } from './orderService';
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

  console.log(JSON.stringify(response, null, 2));

  return response;
}

async function processMercadopagoPayment(formData:CreatePaymentPayload) {
  const { response } = await mercadopagoSave(formData);
  if (!response) throw new Error('Error processing Mercado Pago payment, please try again later');

  return response;
}

export default async function processPayment(body: CreateOrderParams) {
  try {
    if (!body.formData) {
      throw new Error('There was no formData to create the order');
    }
    const orderData = await processMercadopagoPayment(body.formData);
    await createOrder({ ...body, orderData });
    tinyOrderService({ paymentId: orderData.id });
    return orderData;
  } catch (error: any) {
    errorLog(error);
    throw new HttpException(400, 'Error creating the order, please try again later');
  }
}
