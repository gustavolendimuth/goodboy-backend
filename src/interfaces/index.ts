import { ValidationError } from 'joi';
import { JwtPayload } from 'jsonwebtoken';
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
  description?: string
} 

export interface IOrder {
  id?: string,
  user?: IUser,
  items: Items[],
  status: string,
  payedAmount: number,
  paymentMethod: string,
  paymentId: number,
  login?: LoginPayload,
  feeAmount: number,
  userId?: string
}

export interface ILoginPayload extends UserModel {
  token: string,
  data: IUser
}
export type UserPayload = UserModel

export interface IProcessPayment {
  status_detail: string,
  status: string,
  id: number
}
