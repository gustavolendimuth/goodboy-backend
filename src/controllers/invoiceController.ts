/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import querystring from 'querystring';
import invoiceService from '../services/invoiceService';
// import invoice from '../utils/invoice.json';

const invoiceController = async (req: Request, res: Response) => {
  const { body } = req;

  const url = 'https://api.tiny.com.br/api2/nota.fiscal.incluir.php';
  const token = process.env.TINY_TOKEN;
  const data: string = querystring.stringify({
    token,
    nota: JSON.stringify(body),
    formato: 'JSON',
  });

  invoiceService(url, data)
    .then((response: string) => {
      res.status(200).send(response);
    })
    .catch((error: any) => {
      res.status(500).send(error.message);
    });
};

export default invoiceController;
