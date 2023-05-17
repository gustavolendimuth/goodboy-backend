/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { Item, Preference } from '../interfaces';
import errorLog from '../utils/errorLog';
import HttpException from '../utils/HttpException';

export default async (body:any) => {
  const { items } = body;
  const backUrl = `${process.env.BACKEND_URL}/checkout/compra`;

  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  });

  const settingsItems = items.map((item:Item) => ({ ...item, currency_id: 'BRL' }));

  const preference:CreatePreferencePayload & Preference = {
  // o "purpose": "wallet_purchase" permite apenas pagamentos logados
  // para permitir pagamentos como guest, você pode omitir essa propriedade
    items: settingsItems,
    // purpose: 'wallet_purchase',
    back_urls: {
      success: backUrl,
      failure: backUrl,
      pending: backUrl,
    },
    binary_mode: true,
    auto_return: 'all',
    installments: 1,
    statement_descriptor: 'Good Boy',
    notification_url: `${process.env.BACKEND_URL}/ipn?source_news=ipn`,
  };

  return mercadopago.preferences.create(preference)
    .then((response) => response.body.id)
    .catch((error) => {
      errorLog(error);
      throw new HttpException(400, 'Erro ao criar preferência de pagamento');
    });
};
