/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mercadopago from 'mercadopago';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderData, IOrder } from '../interfaces';
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
  const { order, id, items, email } = data;
  let itemsData = order?.additional_info.items;

  const userEmail = email || order?.payer?.email;
  const name = userEmail?.split('@')[0];

  if (!items) {
    itemsData = itemsData?.map((item:{ id:string, quantity:string, title:string, unit_price:string }) => ({
      productId: item.id,
      title: item.title,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
    }));
  }

  const result:IOrder = {
    id,
    items: items || itemsData,
    status: order?.status || 'created',
    totalAmount: order?.transaction_details?.total_paid_amount || order?.transaction_amount,
    netReceivedAmount: order?.transaction_details?.net_received_amount,
    paymentMethod: order?.payment_type_id === 'bank_transfer' ? order?.payment_method_id : order?.payment_type_id,
    paymentId: order?.id,
    feeAmount: order?.fee_details && order.fee_details[0]?.amount,
  };

  try {
    if (userEmail) response = await getUser({ email });
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao buscar usuário, tente mais tarde');
  }

  if (!userEmail) return result;

  if (!response) {
    result.user = { id: uuidv4(), email: userEmail, name };
  } else {
    result.userId = response.id;
  }
  return result;
};
