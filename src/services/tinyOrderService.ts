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
import { getOrderService, updateOrderService } from './orderService';
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
  const id = order.tinyOrderId;
  const tinyClient = new TinyClientClass(order);

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify({ contatos: [{ contato: tinyClient }] }),
    formato: 'JSON',
    id,
  });

  return fetchTiny(url, data);
};

async function updateOrderAddress(paymentId: number, orderData: Partial<Order>) {
  const orderUpdated = await updateOrderService({ paymentId, data: orderData });
  if (orderUpdated[0] === 0) throw new Error('Order not updated');
}

async function updateUserName(order: OrderModel, name: string) {
  order.user.name = name;
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
  const { idNotaFiscal } = invoice.retorno.registros.registro;
  order.invoiceId = idNotaFiscal;
  await order.save();
  return idNotaFiscal;
}

async function emitTinyInvoice(idNotaFiscal: number, order: OrderModel) {
  const invoiceEmit = await tinyEmitInvoiceService(idNotaFiscal);
  order.invoiceStatus = Number(invoiceEmit.retorno.status_processamento);
  await order.save();
}

export async function tinyOrderService(body: Order): Promise<{ message: string }> {
  const { paymentId, name, ...orderData } = body;

  try {
    // Update order address
    if (!paymentId) throw new Error('PaymentId is required');
    if (Object.keys(orderData).length) await updateOrderAddress(paymentId, orderData);

    // Get Order
    const order = await getOrderService({ paymentId });
    if (!order) throw new Error('Order not found');

    // Update user name if exists
    if (name) await updateUserName(order, name);

    // Add order items to tiny
    await addOrderItemsToTiny(order.items);

    // Create tiny order
    let { tinyOrderId } = order;
    if (!tinyOrderId) {
      tinyOrderId = await createTinyOrder(order);
    } else {
      await updateTinyUser(order);
    }

    if (!tinyOrderId) throw new Error('Order not created');

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

    return { message: 'Nota Fiscal gerada' };
  } catch (error: any) {
    errorLog(error);
    throw new HttpException(400, error.message);
  }
}
