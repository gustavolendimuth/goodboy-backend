import Joi from 'joi';
import { IOrder, JoiError } from '../../interfaces';
import HttpException from '../../utils/httpException';

const orderSchema = Joi.object({
  id: Joi.string().length(36).required(),
  status: Joi.string().required(),
  payedAmount: Joi.number().min(1),
  paymentMethod: Joi.string().required(),
  paymentId: Joi.number().required(),
  feeAmount: Joi.number(),
  userId: Joi.string().length(36),
  user: Joi.object({
    id: Joi.string().length(36),
    email: Joi.string().email().required(),
    name: Joi.string().min(3).required(),
  }),
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
    console.log(error);
    throw new HttpException(400, error.message);
  }
};

