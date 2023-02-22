/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';

const { MERCADOPAGO_ACCESS_TOKEN } = process.env;

export const fetchPayment = axios.create({
  baseURL: 'https://api.mercadopago.com/v1/payments/',
  headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
});

export const fetchOrder = axios.create({
  baseURL: 'https://api.mercadopago.com/merchant_orders/',
  headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
});
