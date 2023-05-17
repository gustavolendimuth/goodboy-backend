/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import errorLog from '../utils/errorLog';
import { fetchPayment } from '../utils/fetchMercadoPago';
import HttpException from '../utils/HttpException';

export const paymentService = async (paymentId:string) => {
  try {
    if (!paymentId) throw new Error('paymentId is missing');
    const response = await fetchPayment.get(paymentId);
    return response.data;
  } catch (error:any) {
    errorLog({ error });
    throw new HttpException(400, 'Ops... não encontramos dados sobre este pagamento');
  }
};
