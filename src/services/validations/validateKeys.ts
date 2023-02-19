import dotenv from 'dotenv';
import errorLog from '../../utils/errorLog';
import { IError } from '../../interfaces';

dotenv.config();

export default () => {
  const { MERCADO_PAGO_PUBLIC_KEY, MERCADO_PAGO_ACCESS_TOKEN } = process.env;
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    const err:IError = new Error('Error: access token not defined');
    errorLog(err);
    process.exit(0);
  }

  if (!MERCADO_PAGO_PUBLIC_KEY) {
    const err:IError = new Error('Error: public key not defined');
    errorLog(err);
    process.exit(0);
  }
};
