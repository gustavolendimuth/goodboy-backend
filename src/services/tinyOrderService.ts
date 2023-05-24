/* eslint-disable no-param-reassign */
import querystring from 'querystring';
import TinyProductClass from '../utils/TinyProductClass';
import ItemsModel from '../database/models/ItemsModel';
import { getOrderService } from './orderService';
import fetchTiny from '../utils/fetchTiny';
import { Order } from '../interfaces';
import TinyOrderClass from '../utils/TinyOrderClass';
import OrderModel from '../database/models/OrderModel';
import TinyClientClass from '../utils/TinyClientClass';

const token = process.env.TINY_TOKEN;

export const tinyCreateProductsService = async (body:ItemsModel[]) => {
  const url = 'https://api.tiny.com.br/api2/produto.incluir.php';
  const produtos = body.map((item, index) => ({
    produto: new TinyProductClass(item, index + 1),
  }));

  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    produto: JSON.stringify({ produtos }),
  });

  return fetchTiny(url, data);
};

export const tinyUpdateProductsService = async (body:ItemsModel[]) => {
  const url = 'https://api.tiny.com.br/api2/produto.alterar.php';
  const produtos = body.map((item, index) => ({
    produto: new TinyProductClass(item, index),
  }));

  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    produto: JSON.stringify({ produtos }),
  });

  return fetchTiny(url, data);
};

export const tinyCreateInvoiceService = async (id:number) => {
  const url = 'https://api.tiny.com.br/api2/gerar.nota.fiscal.pedido.php';
  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    id,
    modelo: 'NFe',
  });

  return fetchTiny(url, data);
};

export const tinyEmitInvoiceService = async (id:number) => {
  const url = 'https://api.tiny.com.br/api2/nota.fiscal.emitir.php';
  const data: string = querystring.stringify({
    token,
    formato: 'JSON',
    id,
    enviarEmail: 'S',
  });

  return fetchTiny(url, data);
};

export const tinyCreateOrderService = async (order:OrderModel) => {
  const url = 'https://api.tiny.com.br/api2/pedido.incluir.php';
  const tinyOrder = new TinyOrderClass(order);

  const data:string = querystring.stringify({
    token,
    pedido: JSON.stringify({ pedido: tinyOrder }),
    formato: 'JSON',
  });

  return fetchTiny(url, data);
};

export const tinyUpdateUserService = async (order:OrderModel) => {
  const url = 'https://api.tiny.com.br/api2/contato.alterar.php';
  const tinyClient = new TinyClientClass(order);

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify({ contatos: [{ contato: tinyClient }] }),
    formato: 'JSON',
  });

  return fetchTiny(url, data);
};

export const tinyCreateUserService = async (order:OrderModel) => {
  const url = 'https://api.tiny.com.br/api2/contato.incluir.php';
  const tinyClient = new TinyClientClass(order);

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify({ contatos: [{ contato: tinyClient }] }),
    formato: 'JSON',
  });

  return fetchTiny(url, data);
};

async function updateOrderAddress(order: OrderModel, orderData: Partial<Order>) {
  order.set(orderData);
  await order.save();
  return order;
}

async function updateUser(order: OrderModel, data: { name?:string, cpf?:string }) {
  order.user.name = data.name;
  if (data.cpf) order.user.cpf = data.cpf;
  await order.user.save();
  return order;
}

async function addOrderItemsToTiny(orderItems: ItemsModel[]) {
  const createProduct = await tinyCreateProductsService(orderItems);
  if (createProduct.retorno.status === 'Erro') {
    const updateProduct = await tinyUpdateProductsService(orderItems);
    if (updateProduct.retorno.status === 'Erro') throw new Error('Product not created');
  }
}

async function createTinyUser(order:OrderModel) {
  if (order.tinyOrderId) return order;
  const clientResult = await tinyCreateUserService(order);
  console.log('order', JSON.stringify(order, null, 2));
  console.log('clientResult', clientResult);
  if (clientResult.retorno.status === 'Erro') throw new Error('Client not created');
  const { id: tinyClientId } = clientResult.retorno.registros[0].registro;
  order.user.tinyClientId = tinyClientId;
  await order.user.save();
  return order;
}

async function createTinyOrder(order: OrderModel) {
  if (order.tinyOrderId) return order.tinyOrderId;

  const orderResult = await tinyCreateOrderService(order);
  if (orderResult.retorno.status === 'Erro') throw new Error('Order not created');

  const { id: tinyOrderId } = orderResult.retorno.registros.registro;

  order.tinyOrderId = tinyOrderId;

  await order.save();
  return tinyOrderId;
}

async function updateTinyUser(order: OrderModel) {
  if (!order.tinyOrderId) return;
  const orderResult = await tinyUpdateUserService(order);
  console.log('orderResult', JSON.stringify(orderResult, null, 2));

  if (orderResult.retorno.status === 'Erro') {
    throw new Error(
      orderResult.retorno.registros[0].erros.reduce((acc: string, curr:{ error:string }) => acc + curr.error, ''),
    );
  }
}

async function generateTinyInvoice(tinyOrderId: number, order: OrderModel) {
  const invoice = await tinyCreateInvoiceService(tinyOrderId);
  if (invoice.retorno.status === 'Erro') throw new Error('Invoice not created');
  const { idNotaFiscal, numero } = invoice.retorno.registros.registro;
  order.invoiceId = idNotaFiscal;
  order.invoiceNumber = numero;
  await order.save();
  return idNotaFiscal;
}

async function emitTinyInvoice(idNotaFiscal: number, order: OrderModel) {
  const invoiceEmit = await tinyEmitInvoiceService(idNotaFiscal);
  if (invoiceEmit.retorno.status === 'Erro') throw new Error('Invoice not created');
  order.invoiceStatus = Number(invoiceEmit.retorno.status_processamento);
  order.invoiceUrl = invoiceEmit.retorno.nota_fiscal.link_acesso;
  await order.save();
}

async function fetchTinyOrder(order:OrderModel, orderData:Order) {
  // Add order items to tiny
  await addOrderItemsToTiny(order.items);

  // Create tiny order
  await updateTinyUser(order);
  order = await createTinyUser(order);
  const tinyOrderId = await createTinyOrder(order);
  if (!tinyOrderId) return new Error('Missing tinyOrderId');

  if (!Object.keys(orderData).length) return;

  // Generate tiny invoice
  let { invoiceId: idNotaFiscal } = order;
  if (!idNotaFiscal) {
    idNotaFiscal = await generateTinyInvoice(tinyOrderId, order);
  }

  // Emit tiny invoice
  if ((!order.invoiceStatus || order.invoiceStatus !== 3) && idNotaFiscal) {
    await emitTinyInvoice(idNotaFiscal, order);
  }

  return null;
}

export async function tinyOrderService(body:Order) {
  const { paymentId, name, cpf, ...orderData } = body;

  if (!paymentId) return new Error('PaymentId is required');

  // Get Order
  let order = await getOrderService({ paymentId: paymentId.toString() });
  if (!order) return new Error('Order not found');
  if (order.status !== 'approved') return;

  // Update order address
  if (Object.keys(orderData).length) order = await updateOrderAddress(order, orderData);

  // Update user name if exists
  if (name || cpf) order = await updateUser(order, { name, cpf });

  const error = await fetchTinyOrder(order, orderData);
  return error;
}
