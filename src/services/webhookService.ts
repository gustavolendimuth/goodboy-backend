/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import testeLog from '../utils/testeLog';

export const webhook = async (body:any) => {
  testeLog(body);
  return { message: 'ok' };
};
