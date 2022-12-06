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
  const { login, formData, items } = body;
  console.log(login);
  
  return mercadopago.payment.save(formData)
  .then(async (response) => {
    const { response: data } = response ;
    const email = data.payer.email;
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

    console.log(order);
    const result = await getUser({ email: data.payer.email });
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