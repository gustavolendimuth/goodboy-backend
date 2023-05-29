/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
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
import { getAllOrdersToInvoice, getAllOrdersToTiny } from './ordersService';
import errorLog from '../utils/errorLog';

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
  console.log('Create Invoice', id);

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

export const tinyUpdateUserService = async (orders:OrderModel[]) => {
  const url = 'https://api.tiny.com.br/api2/contato.alterar.php';
  const contatos = {
    contatos: orders.map((order, index) => ({
      contato: new TinyClientClass(order, index),
    })) };
  console.log('Update User', JSON.stringify(contatos, null, 2));

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify(contatos),
    formato: 'JSON',
  });

  return fetchTiny(url, data);
};

export const tinyCreateUserService = async (orders:OrderModel[]) => {
  const url = 'https://api.tiny.com.br/api2/contato.incluir.php';
  const contatos = {
    contatos: orders.map((order, index) => ({
      contato: new TinyClientClass(order, index),
    })) };
  console.log('Update User', JSON.stringify(contatos, null, 2));

  const data:string = querystring.stringify({
    token,
    contato: JSON.stringify(contatos),
    formato: 'JSON',
  });

  return fetchTiny(url, data);
};

async function updateOrderAddress(order: OrderModel, orderData: Partial<Order>) {
  const { address, number, complement, neighborhood, city, state, postalCode } = orderData;
  const userAddress = { address, number, complement, neighborhood, city, state, postalCode };
  order.set(orderData);
  order.user.set(userAddress);
  await order.save();
  await order.user.save();
  return order;
}

async function updateUser(order: OrderModel, data: { name?:string, cpf?:string }) {
  order.user.name = data.name;
  if (data.cpf) order.user.cpf = data.cpf;
  await order.user.save();
  return order;
}

async function addOrderItemsToTiny(orderItems: ItemsModel[]) {
  const updateProduct = await tinyUpdateProductsService(orderItems);
  if (updateProduct.retorno.status === 'Erro') {
    await tinyCreateProductsService(orderItems);
  }
}

// async function createTinyUser(order:OrderModel) {
//   if (order.tinyOrderId) return order;
//   const clientResult = await tinyCreateUserService(order);
//   if (clientResult.retorno.status === 'Erro') throw new Error('Client not created');
//   const { id: tinyClientId } = clientResult.retorno.registros[0].registro;
//   order.user.tinyClientId = tinyClientId;
//   await order.user.save();
//   console.log('clientResult', clientResult);
//   console.log('order', JSON.stringify(order, null, 2));
//   return order;
// }

async function createTinyOrder(order: OrderModel) {
  if (order.tinyOrderId) return order.tinyOrderId;

  const orderResult = await tinyCreateOrderService(order);
  if (orderResult.retorno.status === 'Erro') return;
  console.log('orderResult', JSON.stringify(orderResult, null, 2));

  const { id: tinyOrderId } = orderResult.retorno.registros.registro;

  order.tinyOrderId = tinyOrderId;

  await order.save();
  return tinyOrderId;
}

async function updateTinyUser(orders:OrderModel[]) {
  if (orders.length === 0) return;
  const orderResult = await tinyUpdateUserService(orders);
  // console.log('orderResult', JSON.stringify(orderResult, null, 2));
  return orderResult.retorno.status;
}

async function createOrUpdateTinyUser(orders: OrderModel[]) {
  const createTinyUserResult = await updateTinyUser(orders);

  if (createTinyUserResult === 'Erro') {
    const clientResult = await tinyCreateUserService(orders);

    const ordersPromises = [];
    for (let i = 0; i < orders.length; i += 1) {
      orders[i].user.tinyClientId = clientResult.retorno.registros[i].registro?.id;
      ordersPromises.push(orders[i].user.save());
    }
    await Promise.all(ordersPromises);

    // console.log('clientResult', clientResult);
    // console.log('order', JSON.stringify(orders, null, 2));
  }
  return orders;
}

async function generateTinyInvoice(order:OrderModel) {
  const { tinyOrderId } = order;
  if (!tinyOrderId) return;

  const invoice = await tinyCreateInvoiceService(tinyOrderId);
  console.log('Invoice', JSON.stringify(invoice, null, 2));
  if (!invoice.retorno.registros?.registro) return;
  const { idNotaFiscal, numero } = invoice.retorno.registros.registro;
  order.invoiceId = idNotaFiscal;
  order.invoiceNumber = numero;
  await order.save();
  return idNotaFiscal;
}

async function emitTinyInvoice(idNotaFiscal: number, order: OrderModel) {
  const invoiceEmit = await tinyEmitInvoiceService(idNotaFiscal);
  order.invoiceStatus = Number(invoiceEmit.retorno?.status_processamento);
  order.invoiceUrl = invoiceEmit.retorno.nota_fiscal?.link_acesso;
  await order.save();
}

export async function createTinyOrdersTask() {
  const orders = await getAllOrdersToTiny();
  if (orders.length === 0) return;

  const items = orders.reduce((acc: ItemsModel[], order) => [...acc, ...order.items], []);

  // Add order items to tiny
  await addOrderItemsToTiny(items);

  // Add or update tiny user
  const ordersUpdated = await createOrUpdateTinyUser(orders);
  if (!ordersUpdated) return;

  console.log(JSON.stringify(ordersUpdated, null, 2));

  // Create tiny order
  ordersUpdated.forEach(async (order) => {
    await createTinyOrder(order);
  });
}

async function createTinyInvoice(orders:OrderModel[]) {
  updateTinyUser(orders);
  // console.log('orders', JSON.stringify(orders, null, 2));

  orders.forEach(async (order) => {
  // Generate tiny invoice
    let { invoiceId: idNotaFiscal } = order;
    if (!idNotaFiscal) {
      idNotaFiscal = await generateTinyInvoice(order);
    }

    // Emit tiny invoice
    if ((!order.invoiceStatus || order.invoiceStatus !== 3) && idNotaFiscal) {
      await emitTinyInvoice(idNotaFiscal, order);
    }
  });
}

export async function createTinyInvoiceTask() {
  try {
    const orders = await getAllOrdersToInvoice();
    if (!orders) return;

    await createTinyInvoice(orders);
  } catch (error:any) {
    errorLog({ error });
  }
}

// export async function fetchTinyOrder(order:OrderModel, orderData:Order) {
//   // Add order items to tiny
//   if (!order.tinyOrderId) await addOrderItemsToTiny(order.items);

//   // Update tiny if exists
//   await updateTinyUser(order);

//   // Create tiny order if not exists
//   order = await createTinyUser(order);
//   const tinyOrderId = await createTinyOrder(order);
//   if (!tinyOrderId) return new Error('Missing tinyOrderId');

//   if (!Object.keys(orderData).length) return;

//   // Generate tiny invoice
//   let { invoiceId: idNotaFiscal } = order;
//   if (!idNotaFiscal) {
//     idNotaFiscal = await generateTinyInvoice(tinyOrderId, order);
//   }

//   // Emit tiny invoice
//   if ((!order.invoiceStatus || order.invoiceStatus !== 3) && idNotaFiscal) {
//     await emitTinyInvoice(idNotaFiscal, order);
//   }

//   return null;
// }

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

  // const error = await fetchTinyOrder(order, orderData);
  // return error;
}
