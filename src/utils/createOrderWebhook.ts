/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateOrderDataParams, MercadoPagoItem, OrderParams, SanityProduct } from '../interfaces';
import { getUser } from '../services/usersService';
import errorLog from './errorLog';
import HttpException from './HttpException';
import OrderClass from './OrderClass';
import { getSanityProductsService } from '../services/itemsService';
import OrderSanityProductClass from './OrderSanityProductClass';

const errUser = 'Erro ao buscar usuário, tente mais tarde';
const errOrder = 'Erro ao criar o pedido, tente mais tarde';

export default async ({ orderData }:CreateOrderDataParams) => {
  let user;
  let itemsData;
  let name;
  let userEmail;
  let cpf;

  try {
    if (!orderData || !orderData.additional_info.items) {
      throw new HttpException(400, errOrder);
    }
    const { items } = orderData.additional_info;
    const itemsIds = items?.map((item:MercadoPagoItem) => item.id);
    if (!itemsIds) throw new Error();

    const sanityProducts = (await getSanityProductsService(itemsIds)).map((item:SanityProduct) => ({
      ...item,
      quantity: items?.find((i:MercadoPagoItem) => i.id === item.id)?.quantity,
    }));

    itemsData = sanityProducts?.map((item) => new OrderSanityProductClass(item));
    userEmail = orderData.payer.email;
    name = userEmail?.split('@')[0];
    cpf = orderData.payer.identification.number;

    if (!items) throw new Error();
    if (!userEmail) throw new HttpException(200, 'nothing to update');
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, errOrder);
  }

  try {
    user = await getUser({ email: userEmail });
  } catch (error:any) {
    errorLog(error);
    throw new HttpException(400, errUser);
  }

  const params:OrderParams = { itemsData, orderData, name, cpf };

  if (userEmail) {
    if (!user) {
      params.user = { email: userEmail, name };
    } else {
      params.userId = user.id;
      const { user: _, ...rest } = new OrderClass(params);
      return rest;
    }
  }

  return new OrderClass(params);
};
