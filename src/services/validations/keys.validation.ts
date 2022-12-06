import { IError } from '../../interfaces';
import dotenv from 'dotenv';

dotenv.config();

export default () => {
  const { MERCADO_PAGO_PUBLIC_KEY, MERCADO_PAGO_ACCESS_TOKEN } = process.env;
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
    const err:IError = new Error("Error: access token not defined");
    console.log(err);
    process.exit(1);
  }

    if (!MERCADO_PAGO_PUBLIC_KEY) {
    const err:IError = new Error("Error: public key not defined");
    console.log(err);
    process.exit(1);
  }
}