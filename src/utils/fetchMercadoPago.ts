/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import 'dotenv/config';

export const fetchPayment = axios.create({
  baseURL: 'https://api.mercadopago.com/v1/payments/',
  headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
});

export const fetchOrder = axios.create({
  baseURL: 'https://api.mercadopago.com/merchant_orders/',
  headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
});
