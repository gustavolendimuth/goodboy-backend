/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mercadopago from 'mercadopago';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderData, Order } from '../interfaces';
import { getUser } from '../services/usersService';
import validateKeys from '../services/validations/validateKeys';
import errorLog from './errorLog';
import HttpException from './httpException';

export const mercadopagoSave = async (formData:CreatePaymentPayload) => {
  validateKeys();
  const mercadoPagoAccessToken:string = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  try {
    mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);
    const result = await mercadopago.payment.save(formData);
    if (!result) {
      throw new Error();
    }
    return result;
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(401, 'Erro ao processar pagamento no Mercado Pago, tente mais tarde');
  }
};

export const createOrderData = async (data:CreateOrderData) => {
  let response;
  const { orderData, id, items, email } = data;
  let itemsData = orderData?.additional_info.items;

  const userEmail = email || orderData?.payer?.email;
  const name = userEmail?.split('@')[0];

  if (!items) {
    itemsData = itemsData?.map((item:{ id:string, quantity:string, title:string, unit_price:string }) => ({
      productId: item.id,
      title: item.title,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
    }));
  }

  const order:Order = {
    id,
    items: items || itemsData,
    status: orderData?.status || 'created',
    totalAmount: orderData?.transaction_details?.total_paid_amount || orderData?.transaction_amount,
    netReceivedAmount: orderData?.transaction_details?.net_received_amount,
    paymentMethod: orderData?.payment_type_id === 'bank_transfer'
      ? orderData?.payment_method_id : orderData?.payment_type_id,
    paymentId: orderData?.id,
    feeAmount: orderData?.fee_details && orderData.fee_details[0]?.amount,
  };

  try {
    if (userEmail) response = await getUser({ email: userEmail });
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao buscar usuário, tente mais tarde');
  }

  if (!userEmail) return order;

  if (!response) {
    order.user = { id: uuidv4(), email: userEmail, name };
  } else {
    order.userId = response.id;
  }
  return order;
};
