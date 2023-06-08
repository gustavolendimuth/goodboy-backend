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
  let cpf;

  const userEmail = orderData.payer.email;
  if (!userEmail) return;

  try {
    if (!orderData || !orderData.additional_info.items) {
      throw new Error('orderData is empty');
    }

    const { items } = orderData.additional_info;
    if (!items) throw new Error('items from additional info is missing');

    const itemsIds = items?.map((item:MercadoPagoItem) => item.id);
    if (!itemsIds) throw new Error('items ids is missing');

    const sanityProducts = (await getSanityProductsService(itemsIds)).map((item:SanityProduct) => ({
      ...item,
      quantity: items?.find((i:MercadoPagoItem) => i.id === item._id)?.quantity,
    }));

    itemsData = sanityProducts?.map((item) => new OrderSanityProductClass(item));
    cpf = orderData.payer.identification.number;
  } catch (error:any) {
    errorLog({ error, variables: JSON.stringify({ itemsData, orderData, userEmail }, null, 2) });
    throw new HttpException(400, errOrder);
  }

  try {
    user = await getUser({ email: userEmail });
  } catch (error:any) {
    errorLog({ error, variables: { user } });
    throw new HttpException(400, errUser);
  }

  const params:OrderParams = { itemsData, orderData, cpf };

  if (userEmail) {
    if (!user) {
      params.user = { email: userEmail };
    } else {
      params.userId = user.id;
      const { user: _, ...rest } = new OrderClass(params);
      return rest;
    }
  }

  return new OrderClass(params);
};
