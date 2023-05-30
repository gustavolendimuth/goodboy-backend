/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateOrderDataParams, OrderParams } from '../interfaces';
import { getUser } from '../services/usersService';
import errorLog from './errorLog';
import HttpException from './HttpException';
import OrderClass from './OrderClass';

const errUser = 'Erro ao buscar usuário, tente mais tarde';

export default async ({ orderData }:CreateOrderDataParams) => {
  let user;

  const userEmail = orderData.payer.email;
  if (!userEmail) return;

  try {
    user = await getUser({ email: userEmail });
  } catch (error:any) {
    errorLog({ error });
    throw new HttpException(400, errUser);
  }

  const params:OrderParams = { orderData };

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
