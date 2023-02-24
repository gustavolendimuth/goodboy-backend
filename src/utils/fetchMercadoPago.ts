/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import 'dotenv/config';

const headers = { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` };
const url = 'https://api.mercadopago.com';

export const fetchPayment = axios.create({
  baseURL: `${url}/v1/payments/`,
  headers,
});

export const fetchOrder = axios.create({
  baseURL: `${url}/merchant_orders/`,
  headers,
});

export const fetchUser = axios.create({
  baseURL: `${url}/v1/customers/`,
  headers,
});
