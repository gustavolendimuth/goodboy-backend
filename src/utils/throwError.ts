import { IError } from '../interfaces';

export default (statusCode:number, message:string) => {
  const error = new Error(message) as IError;
  error.statusCode = statusCode;
  throw error;
}