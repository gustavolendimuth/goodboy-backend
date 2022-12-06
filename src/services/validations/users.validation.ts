import Joi from 'joi';
import { IErrType, IUser, JoiError } from '../../interfaces';

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base": `Password should be between 3 to 30 characters and contain letters or numbers only`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),
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