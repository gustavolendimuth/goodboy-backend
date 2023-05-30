import dotenv from 'dotenv';
import errorLog from '../../utils/errorLog';

dotenv.config();

export default () => {
  const { MERCADO_PAGO_PUBLIC_KEY, MERCADO_PAGO_ACCESS_TOKEN } = process.env;
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    const error:Error = new Error('Error: access token not defined');
    errorLog({ error });
    process.exit(0);
  }

  if (!MERCADO_PAGO_PUBLIC_KEY) {
    const error:Error = new Error('Error: public key not defined');
    errorLog({ error });
    process.exit(0);
  }
};
