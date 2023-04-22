/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../database/models/UserModel';
import { ILogin } from '../interfaces';
import { createJwtToken, validateJwtToken } from '../utils/jwtUtils';
// import validateLogin from './validations/loginValidation';
import sendMagicLink from '../utils/sendMagicLink';
import HttpException from '../utils/HttpException';

const login = async (body: ILogin) => {
  // validateLogin(body);
  const { email, magicLink, token } = body;

  if (token) {
    validateJwtToken(token);
    return { message: 'Login efetuado com sucesso' };
  }

  const newMagicLink = uuidv4();
  const response = await UserModel.findOne({ where: { email } });

  if (!response) {
    throw new HttpException(401, 'Nenhuma compra realizada com este email');
  }

  if (!magicLink) {
    response.set({ magicLink: newMagicLink, magicLinkExpired: false });
    await response.save();
    sendMagicLink(email, newMagicLink).catch((e) => console.log(e));
    return { message: `Email com link de login enviado para ${email}` };
  }

  if (response.magicLinkExpired || response.magicLink !== magicLink) {
    throw new HttpException(401, 'Link de login expirado. Faça login novamente');
  }

  response.set({ magicLinkExpired: true });
  await response.save();
  const result = createJwtToken({ name: response.name, email: response.email, role: response.role, id: response.id });
  return { token: result };
};

export default login;
