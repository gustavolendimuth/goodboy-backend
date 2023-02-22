/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ValidationError } from 'joi';
import { JwtPayload } from 'jsonwebtoken';
import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
import UserModel from '../database/models/UserModel';

export interface IProduct {
  id?: number,
  title: string,
  unit_price: number,
  quantity: number,
  description?: string,
}

export interface IUser {
  id?: string,
  email: string,
  name: string,
  role?: string
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
  id?: number,
  userId: string,
  productsIds: [number]
}

export interface ILogin {
  email: string,
  magicLink: string,
  token: string
}

export interface IGetUser {
  id?: string,
  email?: string,
  password?: string
}

export interface IErrType {
  [key: string]: number
}

export interface Items {
  id?: number,
  title: string,
  quantity: number,
  unit_price: number,
  currency_id?: string,
}

export interface Order {
  id?: string,
  user?: IUser,
  userId?: string
  paymentId?: number,
  preferenceId?: string,
  items?: Items[],
  totalAmount: number,
  feeAmount?: number,
  netReceivedAmount?: number,
  paymentMethod: string,
  status: string,
  login?: LoginPayload,
}

export interface ILoginPayload extends UserModel {
  token: string,
  data: IUser
}
export type UserPayload = UserModel;

export interface IProcessPayment {
  status_detail: string,
  status: string,
  id: number
}

export interface Preference {
  items: Items[],
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
  items: Items[],
  formData: CreatePaymentPayload,
  preferenceId?: string,
}

export interface CreateOrderData {
  orderData:any,
  id?:string,
  items?:Items[],
  email:string,
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
