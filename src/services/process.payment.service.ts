/* eslint-disable @typescript-eslint/no-explicit-any */
import mercadopago from "mercadopago";
import validateKeys from './validations/keys.validation';
import { createOrder } from './order.service';
import { validateOrder } from './validations/order.validation';
import { getUser } from './users.service';
import { IOrder, IUser } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';


export const processPayment = async (body:never) => {
  validateKeys();
  const mercadoPagoAccessToken:string = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '';
  mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);
  const { formData, items } = body;
  console.log(formData);
  const { payer: { email } } = formData as any;

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
  
  return mercadopago.payment.save(formData)
  .then(async (response) => {
    const { response: data } = response ;
    // const email = data.payer.email;
    const name = email.split('@')[0];

    console.log(email);
    

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
  }).catch((error) => {
    console.log(error);
    throw error;
  });
}