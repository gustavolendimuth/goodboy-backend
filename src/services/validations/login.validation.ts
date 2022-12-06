import Joi from 'joi';
import { ILogin, JoiError } from '../../interfaces';

const validateLogin = (body: ILogin) => {
  const schema = Joi.object({
    password: Joi.string().required().messages({ 
      'any.required': '"password" is required',
      'string.empty': '"password" is required'
    }),
    email: Joi.string().email().required()
      .messages({ 
        'any.required': '"email" is required',
        'string.empty': '"email" is required',
        'string.email': 'email inválido'
      }),
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