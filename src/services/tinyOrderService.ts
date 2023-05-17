/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import querystring from 'querystring';
import HttpException from '../utils/HttpException';
import TinyProductClass from '../utils/TinyProductClass';
import ItemsModel from '../database/models/ItemsModel';
import { getOrderService } from './orderService';
import fetchTiny from '../utils/fetchTiny';
import { Order } from '../interfaces';
import TinyOrderClass from '../utils/TinyOrderClass';
import OrderModel from '../database/models/OrderModel';
import errorLog from '../utils/errorLog';
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

async function updateOrderAddress(order: OrderModel, orderData: Partial<Order>) {
  order.set(orderData);
  order.save();
}

async function updateUser(order: OrderModel, data: { name:string, cpf?:string }) {
  order.user.name = data.name;
  if (data.cpf) order.user.cpf = data.cpf;
  await order.user.save();
}

async function addOrderItemsToTiny(orderItems: ItemsModel[]) {
  const createProduct = await tinyCreateProductsService(orderItems);
  if (createProduct.retorno.status === 'Erro') {
    const updateProduct = await tinyUpdateProductsService(orderItems);
    if (updateProduct.retorno.status === 'Erro') throw new Error('Product not created');
  }
}

async function createTinyOrder(order: OrderModel) {
  const orderResult = await tinyCreateOrderService(order);
  if (orderResult.retorno.status === 'Erro') throw new Error('Order not created');
  const { id } = orderResult.retorno.registros.registro;
  order.tinyOrderId = id;
  await order.save();
  return id;
}

async function updateTinyUser(order: OrderModel) {
  const orderResult = await tinyUpdateUserService(order);
  console.log(JSON.stringify(orderResult, null, 2));
  if (orderResult.retorno.status === 'Erro') throw new Error('Order not updated');
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
  let { tinyOrderId } = order;
  if (!tinyOrderId) {
    tinyOrderId = await createTinyOrder(order);
  } else {
    await updateTinyUser(order);
  }
  if (!tinyOrderId) throw new Error('Missing tinyOrderId');

  if (!Object.keys(orderData).length) {
    return { message: 'Pedido criado' };
  }

  // Generate tiny invoice
  let idNotaFiscal = order.invoiceId;
  if (!idNotaFiscal) {
    idNotaFiscal = await generateTinyInvoice(tinyOrderId, order);
  }

  // Emit tiny invoice
  if ((!order.invoiceStatus || order.invoiceStatus !== 3) && idNotaFiscal) {
    await emitTinyInvoice(idNotaFiscal, order);
  }
}

export async function tinyOrderService(body:Order): Promise<{ message: string }> {
  const { paymentId, name, cpf, ...orderData } = body;

  try {
    if (!paymentId) throw new Error('PaymentId is required');

    // Get Order
    const order = await getOrderService({ paymentId: paymentId.toString() });
    if (!order) throw new Error('Order not found');
    if (order.status !== 'approved') throw new Error('Order payment not approved');

    // Update order address
    if (Object.keys(orderData).length) updateOrderAddress(order, orderData);

    // Update user name if exists
    if (name) await updateUser(order, { name, cpf });

    fetchTinyOrder(order, orderData);

    return { message: 'Nota Fiscal gerada' };
  } catch (error: any) {
    errorLog({ error });
    throw new HttpException(400, error.message);
  }
}
