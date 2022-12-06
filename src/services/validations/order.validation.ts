import Joi from 'joi';
import { IOrder, JoiError } from '../../interfaces';

const schema = Joi.object({
  id: Joi.string().length(36),
  status: Joi.string().required(),
  payedAmount: Joi.number().min(1).required(),
  paymentMethod: Joi.string().required(),
  paymentId: Joi.number().required(),
  feeAmount: Joi.number().min(1).required(),
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
        unitPrice: Joi.number().min(1).required(),
        description: Joi.string(),
      })
    ).required(),
});

export const validateOrder = (body: IOrder): void => {
  const { error } = schema.validate(body);
  if (error) {
    const err = error as JoiError;
    err.statusCode = 400;
    throw err;
  }
};
