/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import createOrderIpn from '../utils/createOrderIpn';
import { createOrderService, getOrderService, updateOrderService } from './orderService';

export const ipnService = async (paymentId:string, topic:string) => {
  console.log('ipn', topic);

  if (topic === 'payment') {
    try {
      // Pega os dados do pagamento no Mercado Pago
      const payment = await fetchPayment.get(paymentId);
      if (!payment.data.payer.email) return;

      // Verifica se o pedido já existe
      const order = await getOrderService({ paymentId });

      // Cria o objeto do pedido
      const orderData = await createOrderIpn({ orderData: payment.data });
      if (!orderData) return;
      console.log('IPN order data', orderData);

      // Cria o pedido caso ele não exista
      if (!order) {
        await createOrderService(orderData);
        return;
      }
      // Atualiza o pedido caso ele já exista
      await updateOrderService({ data: orderData, paymentId: Number(paymentId) });
    } catch (error:any) {
      errorLog({ error, variables: JSON.stringify({ paymentId, topic }, null, 2) });
      throw new HttpException(400, 'IPN service error');
    }
  }
};
