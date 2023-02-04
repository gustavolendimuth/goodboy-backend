/* eslint-disable @typescript-eslint/no-explicit-any */
import mercadopago from "mercadopago";
import validateKeys from './validations/keysValidation';
import { createOrder } from './orderService';
import { getUser } from './usersService';
import { IOrder, IUser } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import { validateOrder } from './validations/orderValidation';
import HttpException from '../utils/httpException';

export const processPayment = async (body:never) => {
  validateKeys();
  const mercadoPagoAccessToken:string = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  const { formData, items } = body;
  const { payer: { email } } = formData as any;
  let response;  

//   const preference = {
//   // o "purpose": "wallet_purchase" permite apenas pagamentos logados
//   // para permitir pagamentos como guest, você pode omitir essa propriedade
//   "items": items,
// };

// mercadopago.preferences.create(preference)
//   .then(function (response) {
//     // Este valor é o preferenceId que será enviado para o Brick na inicialização
//     const preferenceId = response.body.id;
//   }).catch(function (error) {
//     console.log(error);
//   });

  try {
  mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);
  response = await mercadopago.payment.save(formData);
  } catch(error) {
    console.log(error);
    throw new HttpException(401, 'Erro ao processar pagamento no Mercado Pago');
  }

  try {
  const { response: data } = response ;
  // const email = data.payer.email;
  const name = email.split('@')[0];

  const user:IUser = { id: uuidv4(), email, name };
  const order:IOrder = {
    id: uuidv4(),
    items,
    status: data.status,
    payedAmount: data.transaction_details.total_paid_amount,
    paymentMethod: data.payment_type_id,
    paymentId: data.id,
    feeAmount: data.fee_details[0].amount,
  };

  const result = await getUser({ email });
  if (!result) {
    order.user = user;
  } else {
    order.userId = result.id;
  }

  validateOrder(order);

  createOrder(order);
  return data;
  } catch (error) {
    console.log(error);
    throw new HttpException(401, 'Erro ao criar o pedido');
  }
}