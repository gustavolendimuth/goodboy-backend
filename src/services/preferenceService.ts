/* eslint-disable @typescript-eslint/no-unused-vars */
import mercadopago from "mercadopago";
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { Preference, SettingsItems } from '../interfaces';

const preferenceService = async (body:any) => {
  const { items } = body;
  let preferenceId:string;

  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  });

  const settingsItems = items.map((item:any) => ({
    id: item.productId,
    title: item.title,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    currency_id: 'BRL',
  }));

  const preference:CreatePreferencePayload & Preference = {
  // o "purpose": "wallet_purchase" permite apenas pagamentos logados
  // para permitir pagamentos como guest, você pode omitir essa propriedade
  items: settingsItems,
  back_urls: {
    "success": "https://goodboy.net.br/checkout/compra",
    "failure": "https://goodboy.net.br/checkout/compra",
    "pending": "https://goodboy.net.br/checkout/compra"
},
  binary_mode: true,
  auto_return: "all",
  installments: 1,
  statement_descriptor: "Good Boy"
};

  return mercadopago.preferences.create(preference)
  .then(function (response) {
    // Este valor é o preferenceId que será enviado para o Brick na inicialização
    preferenceId = response.body.id;
    return preferenceId;
  }).catch(function (error) {
    console.log(error);
    throw new Error('Erro ao criar preferência de pagamento');
  });
};

export default preferenceService;