import Joi from 'joi';
import { IErrType, IUser, JoiError } from '../../interfaces';

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string(),
  magicLink: Joi.string().length(36),
});

const validateUser = (body: IUser): void => {
  const { error, value } = schema.validate(body);
  
  const err = error as JoiError;
  if (err) {
    const errType: string = err.details[0].type;
    const errCode: IErrType = {
      'string.base': 422,
      'any.required': 400,
      'string.empty': 400,
      'string.min': 422,
      'string.email': 422,
      'number.base': 422,
      'number.empty': 400,
      'number.min': 422,
    };
    err.statusCode = errCode[errType];
    throw err;
  }
};

export default validateUser;