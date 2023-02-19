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
  const { order, id, items, email, preferenceId } = data;
  const name = email.split('@')[0];

  const netReceivedAmount = order.transaction_details
  && (order?.transaction_details?.total_paid_amount || 0) - (order?.fee_details[0]?.amount || 0);

  const result:IOrder = {
    id,
    items,
    status: order?.status || 'pending',
    totalAmount: order?.transaction_details?.total_paid_amount
    || order?.transaction_amount,
    netReceivedAmount,
    preferenceId,
    paymentMethod: order?.payment_type_id,
    paymentId: order?.id,
    feeAmount: order.fee_details && order.fee_details[0]?.amount,
  };

  try {
    response = await getUser({ email });
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, 'Erro ao buscar usuário, tente mais tarde');
  }

  if (!response) {
    result.user = { id: uuidv4(), email, name };
  } else {
    result.userId = response.id;
  }
  return result;
};
