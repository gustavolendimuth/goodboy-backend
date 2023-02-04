import Joi from 'joi';
import { IOrder, JoiError } from '../../interfaces';
import HttpException from '../../utils/httpException';

const orderSchema = Joi.object({
  id: Joi.string().length(36).required(),
  status: Joi.string().required(),
  payedAmount: Joi.number().min(1).required(),
  paymentMethod: Joi.string().required(),
  paymentId: Joi.number().required(),
  feeAmount: Joi.number().required(),
  userId: Joi.string().length(36).required(),
  user: Joi.object({
    id: Joi.string().length(36),
    email: Joi.string().email().required(),
    name: Joi.string().min(3).required(),
  }).required(),
  items: Joi.array().items(
      Joi.object({
        productId: Joi.string().length(36).required(),
        title: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().required(),
      })
    ).required(),
});

export const validateOrder = (body: IOrder): void => {
  const { error } = orderSchema.validate(body);
  if (error) {
    throw new HttpException(400, error.message);
  }
};

const preOrderSchema = Joi.object({
  id: Joi.string().length(36).required(),
  status: Joi.string().required(),
  payedAmount: Joi.number().min(1).required(),
  paymentMethod: Joi.string().required(),
  paymentId: Joi.number().required(),
  feeAmount: Joi.number().required(),
  userId: Joi.string().length(36).required(),
  user: Joi.object({
    id: Joi.string().length(36).required(),
    email: Joi.string().email().required(),
    name: Joi.string().min(3).required(),
  }).required(),
  items: Joi.array().items(
      Joi.object({
        productId: Joi.string().length(36).required(),
        title: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        unitPrice: Joi.number().required(),
      })
    ).required(),
});

export const validatePreOrder = (body: IOrder): void => {
  const { error } = preOrderSchema.validate(body);
  if (error) {
    const err = error as JoiError;
    err.statusCode = 400;
    throw err;
  }
};
