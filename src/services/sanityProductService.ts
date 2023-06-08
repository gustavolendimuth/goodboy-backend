/* eslint-disable import/prefer-default-export */
import querystring from 'querystring';
import fetchTiny from '../utils/fetchTiny';
import { SanityProduct } from '../interfaces';
import SanityProductClass from '../utils/SanityProductClass';

const token = process.env.TINY_TOKEN;

export const sanityProductCreateService = async (body:SanityProduct) => {
  const url = 'https://api.tiny.com.br/api2/produto.incluir.php';
  const produtos = [{
    produto: new SanityProductClass(body),
  }];

  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    produto: JSON.stringify({ produtos }),
  });

  console.log('Create product response', JSON.stringify(produtos, null, 2));
  const response = await fetchTiny(url, data);
  console.log('Create product response', JSON.stringify(response, null, 2));
};

export const sanityProductUpdateService = async (body:SanityProduct) => {
  const url = 'https://api.tiny.com.br/api2/produto.alterar.php';
  const produtos = [{
    produto: new SanityProductClass(body),
  }];

  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    produto: JSON.stringify({ produtos }),
  });

  console.log('Update product', JSON.stringify(produtos, null, 2));
  const response = await fetchTiny(url, data);
  console.log('Update product response', JSON.stringify(response, null, 2));
};
