/* eslint-disable import/no-cycle */
/* eslint-disable max-lines */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ValidationError } from 'joi';
import { JwtPayload } from 'jsonwebtoken';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';

export interface IProduct {
  id?: number,
  title: string,
  unit_price: number,
  quantity: number,
  description?: string,
}

export interface IUser {
  id?: number,
  email?: string,
  name?: string,
  cpf?: string,
  role?: string
  magicLink?: string;
  magicLinkExpired?: boolean;
}

export interface IError extends Error {
  statusCode?: number
}

export interface User {
  user: JwtPayload | string
}

export interface LoginPayload {
  data: IUser,
  iat: number
}

export interface IAuthorization extends Headers {
  authorization: string
}

export interface JoiError extends ValidationError {
  statusCode?: number
}

export interface IOrders {
  id?: string,
  userId: string,
  productsIds: [number]
}

export interface ILogin {
  email: string,
  magicLink: string,
  token: string
}

export interface GetUser {
  id?: string,
  email?: string,
  password?: string
}

export interface IErrType {
  [key: string]: number
}

export interface MercadoPagoItem {
  id: string,
  title: string,
  quantity: number,
  unit_price: number,
  currency_id?: string,
  ncm?: string,
  image?: string,
}

export interface Item {
  id?: number,
  orderId?: number,
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  ncm?: string;
  image?: string;
}

export interface SanityProduct {
  id: string;
  title: string;
  price: number;
  ncm: string;
  image: string;
  quantity?: number;
}

export interface TinyProduct {
  sequencia: string;
  codigo: string;
  nome: string;
  unidade: string;
  preco: string;
  ncm: string;
  origem: string;
  situacao: string;
  tipo: string;
  anexos: [{ anexo: string }];
}
export interface TinyItem {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: string;
  valor_unitario: string;
}

export interface TinyClient {
  codigo?: string,
  nome?: string,
  email?: string,
  tipo_pessoa?: string,
  cpf_cnpj?: string,
  endereco?: string,
  numero?: string,
  complemento?: string,
  bairro?: string,
  cep?: string,
  cidade?: string,
  uf?: string
}

export interface TinyOrder {
  cliente: TinyClient,
  itens: { item: TinyItem }[],
  forma_pagamento: string,
  meio_pagamento: 'Mercado Pago' | 'Brix Mercado Pago',
  frete_por_conta: 'S',
  numero_pedido_ecommerce: number,
  situacao: 'Entregue',
  obs?: string
}

export interface Order {
  id?: number,
  userId?: number,
  name?: string,
  users?: IUser,
  paymentId?: number,
  totalAmount?: number,
  feeAmount?: number,
  netReceivedAmount?: number,
  paymentMethod?: string,
  status?: string,
  address?: string,
  number?: string,
  complement?: string,
  neighborhood?: string,
  postalCode?: string,
  city?: string,
  state?: string,
  tinyOrderId?: number,
  invoiceId?: number,
  invoiceStatus?: number,
}

export interface OrderParams {
  itemsData?: Item[],
  orderData?: OrderData,
  user?:IUser,
  userId?:number
  userEmail?:string,
  name?:string,
  cpf?:string,
}

export interface OrderData {
  status?: string;
  transaction_details?: {
    total_paid_amount?: number;
    net_received_amount?: number;
  };
  additional_info: { items: MercadoPagoItem[] };
  payer: {
    email: string
    identification: {
      number: string
    },
  },
  payment_type_id?: string;
  payment_method_id?: string;
  id?: number;
  fee_details?: {
    amount?: number;
  }[];
}

export interface ILoginPayload extends IUser {
  token: string,
  data: IUser
}

export interface IProcessPayment {
  status_detail: string,
  status: string,
  id: number
}

export interface Preference {
  items: MercadoPagoItem[],
  back_urls: {
    success: string,
    failure: string,
    pending: string
  },
  binary_mode: boolean,
  auto_return: string,
  installments: number,
  statement_descriptor: string
}

export interface ProcessPaymentBody {
  items: MercadoPagoItem[],
  formData: CreatePaymentPayload,
  preferenceId?: string,
}

export interface CreateOrderDataParams {
  orderData:OrderData,
  items?:MercadoPagoItem[],
  email?:string,
}

export interface CreateOrderParams extends CreateOrderDataParams {
  formData:CreatePaymentPayload,
}

export interface WebhookBody {
  action:string,
  api_version:string,
  data:{ id:string },
  date_created:string,
  id:number,
  live_mode:boolean,
  type:string,
  user_id:string,
}
