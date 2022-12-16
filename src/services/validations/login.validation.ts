import Joi from 'joi';
import { ILogin, JoiError } from '../../interfaces';

const validateLogin = (body: ILogin) => {
  const schema = Joi.object({
    email: Joi.string().email()
      .messages({ 
        'any.required': '"email" is required',
        'string.empty': '"email" is required',
        'string.email': 'email inválido'
      }),
      magicLink: Joi.string().length(36),
      token: Joi.string(),
  });

  const { error, value } = schema.validate(body);
  const err = error as JoiError;
  if (err) {
    err.statusCode = 400;
    throw err;
  }

  return value;
};

export default validateLogin;