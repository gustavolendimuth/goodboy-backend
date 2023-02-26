/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mercadopago from 'mercadopago';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderParams, MercadoPagoItem, OrderParams } from '../interfaces';
import { getUser } from '../services/usersService';
import validateKeys from '../services/validations/validateKeys';
import errorLog from './errorLog';
import HttpException from './HttpException';
import OrderClass from './OrderClass';
import OrderItem from './OrderItem';

const errUser = 'Erro ao buscar usuário, tente mais tarde';

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

export const createOrderIpn = async ({ orderData, id }:CreateOrderParams) => {
  let user;

  if (!orderData || !orderData.additional_info.items) {
    throw new HttpException(400, 'Erro ao processar o pagamento, tente mais tarde');
  }

  const { items } = orderData.additional_info;
  const itemsData = items?.map((item) => new OrderItem(item));
  const userEmail = orderData.payer.email;
  const name = userEmail?.split('@')[0];

  if (!items || !userEmail || !name) throw new HttpException(400, errUser);

  try {
    user = await getUser({ email: userEmail });
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, errUser);
  }

  const params:OrderParams = { itemsData, id, orderData };

  if (userEmail) {
    if (!user) {
      params.user = { id: uuidv4(), email: userEmail, name };
    } else {
      params.userId = user.id;
      const { user: _, ...rest } = new OrderClass(params);
      return rest;
    }
  }

  const randomUser = uuidv4();
  if (!userEmail) {
    params.user = {
      id: uuidv4(), name: `indefinido-${randomUser}`, email: `indefinido@${randomUser}.com`,
    };
  }

  return new OrderClass(params);
};

export const createOrderData = async ({ orderData, id, email, items }:CreateOrderParams) => {
  let user;
  const userEmail = email || orderData?.payer?.email;
  const name = userEmail?.split('@')[0];

  if (!items || !userEmail || !name) throw new HttpException(400, errUser);

  try {
    if (userEmail) user = await getUser({ email: userEmail });
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, errUser);
  }

  const itemsData = items.map((item:MercadoPagoItem) => new OrderItem(item));

  const params:OrderParams = { itemsData, id, orderData };

  if (userEmail) {
    if (!user) {
      params.user = { id: uuidv4(), email: userEmail, name };
    } else {
      params.userId = user.id;
      const { user: _, ...rest } = new OrderClass(params);
      return rest;
    }
  }

  return new OrderClass(params);
};

export const createOrderWebhook = async ({ orderData }:CreateOrderParams) => {
  const { user, ...rest } = new OrderClass({ orderData });
  return rest;
};
