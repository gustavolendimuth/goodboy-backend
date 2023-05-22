/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateOrderParams, MercadoPagoItem, OrderParams } from '../interfaces';
import HttpException from './HttpException';
import OrderItemClass from './OrderItemClass';
import { getUser } from '../services/usersService';
import errorLog from './errorLog';
import OrderClass from './OrderClass';

const ERROR_USER = 'Error retrieving user, please try again later';

async function getUserOrThrow(email:string) {
  try {
    return await getUser({ email }) || undefined;
  } catch (error: any) {
    errorLog({ error });
    throw new HttpException(400, ERROR_USER);
  }
}

function buildOrderParams(params: OrderParams) {
  const { user, userEmail, cpf } = params;
  const updatedParams = { ...params };

  if (userEmail) {
    if (!user) {
      updatedParams.user = { email: userEmail, cpf };
    } else {
      updatedParams.userId = user.id;
      const { user: _, ...order } = new OrderClass(updatedParams);
      return order;
    }
  }
  return new OrderClass(updatedParams);
}

function processItems(items: MercadoPagoItem[]) {
  return items.map((item: MercadoPagoItem) => new OrderItemClass(item));
}

export default async function createOrderData({ formData, orderData, email, items }: CreateOrderParams) {
  const userEmail = email || formData?.payer?.email;

  const cpf = formData?.payer?.identification?.number;

  const name = userEmail?.split('@')[0];
  if (!name) {
    throw new HttpException(400, 'Nothing to update');
  }

  if (!items) {
    throw new HttpException(400, ERROR_USER);
  }

  const user = await getUserOrThrow(userEmail);
  const itemsData = processItems(items);
  const params: OrderParams = { itemsData, orderData, user, userEmail, cpf };

  return buildOrderParams(params);
}
