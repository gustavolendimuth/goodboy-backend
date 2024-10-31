import querystring from 'querystring';
import OrderModel from '../database/models/OrderModel';
import TinyClientClass from './TinyClientClass';
import TinyOrderClass from './TinyOrderClass';
import fetchTiny from './fetchTiny';
import ItemsModel from '../database/models/ItemsModel';
import TinyProductClass from './TinyProductClass';

const token = process.env.TINY_TOKEN;

export const fetchTinyInvoiceCreate = async (id:number) => {
  const url = 'https://api.tiny.com.br/api2/gerar.nota.fiscal.pedido.php';

  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    id,
    modelo: 'NFe',
  });

  console.log('Create Invoice', id);
  const response = await fetchTiny(url, data);
  console.log('Create invoice response', JSON.stringify(response, null, 2));
  return response;
};

export const fetchTinyInvoiceEmit = async (id:number) => {
  const url = 'https://api.tiny.com.br/api2/nota.fiscal.emitir.php';
  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    id,
    enviarEmail: 'S',
  });

  console.log('Emit invoice id', JSON.stringify(id, null, 2));
  const response = await fetchTiny(url, data);
  console.log('Emit invoice response', JSON.stringify(response, null, 2));
  return response;
};

export const fetchTinyOrderCreate = async (order:OrderModel) => {
  const url = 'https://api.tiny.com.br/api2/pedido.incluir.php';
  const tinyOrder = new TinyOrderClass(order);

  const data:string = querystring.stringify({
    token,
    pedido: JSON.stringify({ pedido: tinyOrder }),
    formato: 'JSON',
  });

  // console.log('Create order', JSON.stringify(tinyOrder, null, 2));
  const response = await fetchTiny(url, data);
  // console.log('Create order response', JSON.stringify(response, null, 2));
  return response;
};

export const fetchTinyUserUpdate = async (orders:OrderModel[]) => {
  const url = 'https://api.tiny.com.br/api2/contato.alterar.php';
  const contatos = {
    contatos: orders.map((order, index) => ({
      contato: new TinyClientClass(order, index),
    })) };

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify(contatos),
    formato: 'JSON',
  });

  // console.log('Update User', JSON.stringify(contatos, null, 2));
  const response = await fetchTiny(url, data);
  // console.log('Update user response', JSON.stringify(response, null, 2));
  return response;
};

export const fetchTinyItemsCreate = async (orders:OrderModel[]) => {
  const url = 'https://api.tiny.com.br/api2/produto.incluir.php';

  const items = orders.reduce((acc:ItemsModel[], order) => {
    acc.push(...order.items);
    return acc;
  }, []);

  const produtos = {
    produtos: items.map((order, index) => ({
      produto: new TinyProductClass(order, index),
    })) };

  const data:string = querystring.stringify({
    token,
    produto: JSON.stringify(produtos),
    formato: 'JSON',
  });

  console.log('Create Product', JSON.stringify(produtos, null, 2));
  const response = await fetchTiny(url, data);
  console.log('Create product response', JSON.stringify(response, null, 2));
  return response;
};

export const fetchTinyUserCreate = async (orders:OrderModel[]) => {
  const url = 'https://api.tiny.com.br/api2/contato.incluir.php';
  const contatos = {
    contatos: orders.map((order, index) => ({
      contato: new TinyClientClass(order, index),
    })) };

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify(contatos),
    formato: 'JSON',
  });

  // console.log('Create User', JSON.stringify(contatos, null, 2));
  const response = await fetchTiny(url, data);
  // console.log('Create user response', JSON.stringify(response, null, 2));
  return response;
};
