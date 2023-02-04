import Joi from 'joi';
import { ILogin } from '../../interfaces';
import HttpException from '../../utils/httpException';

const validateLogin = (body: ILogin) => {
  const schema = Joi.object({
    email: Joi.string().email().required()
      .messages({ 
        'any.required': '"email" is required',
        'string.empty': '"email" is required',
        'string.email': 'email inválido'
      }),
      magicLink: Joi.string().length(36),
      token: Joi.string(),
  });

  const { error, value } = schema.validate(body);
  if (error) {
    throw new HttpException(400, error?.message)
  }

  return value;
};

export default validateLogin;