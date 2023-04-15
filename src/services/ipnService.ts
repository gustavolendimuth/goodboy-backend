/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';
import createOrderIpn from '../utils/createOrderIpn';
import { createOrderService, getOrderService, updateOrderService } from './orderService';

export const ipnService = async (id:string, topic:string) => {
  if (topic === 'payment') {
    try {
      // Pega os dados do pagamento no Mercado Pago
      const payment = await fetchPayment.get(id);
      if (!payment.data.payer.email) return { status: 200, message: 'nothing to update' };

      // Verifica se o pedido já existe
      const order = await getOrderService({ paymentId: Number(id) });
      // Cria o objeto do pedido
      const orderData = await createOrderIpn({ orderData: payment.data });
      // Atualiza o pedido caso ele já exista
      if (order) {
        await updateOrderService({ data: orderData, paymentId: Number(id) });
        return { message: 'order updated' };
      }
      // Cria o pedido caso ele não exista
      await createOrderService(orderData);
      return { message: 'order created' };
    } catch (error:any) {
      errorLog(error);
      throw new HttpException(400, 'Erro ao criar o pedido');
    }
  }

  return { message: 'nothing to update' };
};
