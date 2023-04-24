/* eslint-disable import/prefer-default-export */
import Joi from 'joi';
import { Order } from '../../interfaces';
import errorLog from '../../utils/errorLog';
import HttpException from '../../utils/HttpException';

const orderSchema = Joi.object({
  userId: Joi.number(),
  user: Joi.object({
    id: Joi.number(),
    email: Joi.string().email().required(),
    name: Joi.string().min(3).required(),
    cpf: Joi.string().length(11),
  }),
  paymentId: Joi.number(),
  totalAmount: Joi.number(),
  feeAmount: Joi.number(),
  netReceivedAmount: Joi.number(),
  paymentMethod: Joi.string(),
  status: Joi.string(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().length(36).required(),
      title: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().required(),
      ncm: Joi.string().required(),
      image: Joi.string().required(),
    }),
  ).required(),
});

export const validateOrder = (body:Order): void => {
  const { error } = orderSchema.validate(body);
  if (error) {
    errorLog(error);
    throw new HttpException(400, error.message);
  }
};
