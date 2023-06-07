/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { getOrderService } from './orderService';
import { Order } from '../interfaces';
import OrderModel from '../database/models/OrderModel';
import { getAllOrdersToInvoice, getAllOrdersToTiny } from './ordersService';
import errorLog from '../utils/errorLog';
import {
  fetchTinyInvoiceCreate,
  fetchTinyInvoiceEmit,
  fetchTinyOrderCreate,
  fetchTinyUserCreate,
  fetchTinyUserUpdate,
} from '../utils/fetchTinyData';

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

async function createTinyOrder(order: OrderModel) {
  if (order.tinyOrderId) return order.tinyOrderId;

  const orderResult = await fetchTinyOrderCreate(order);
  if (orderResult.retorno.status === 'Erro') return;
  console.log('orderResult', JSON.stringify(orderResult, null, 2));

  const { id: tinyOrderId } = orderResult.retorno.registros.registro;
  order.tinyOrderId = tinyOrderId;
  await order.save();
  return tinyOrderId;
}

async function updateTinyUser(orders:OrderModel[]) {
  if (orders.length === 0) return;
  const orderResult = await fetchTinyUserUpdate(orders);
  return orderResult.retorno.status;
}

async function createOrUpdateTinyUser(orders: OrderModel[]) {
  const createTinyUserResult = await updateTinyUser(orders);
  if (createTinyUserResult === 'Erro') {
    const clientResult = await fetchTinyUserCreate(orders);

    const ordersPromises = [];
    for (let i = 0; i < orders.length; i += 1) {
      orders[i].user.tinyClientId = clientResult.retorno.registros[i].registro?.id;
      ordersPromises.push(orders[i].user.save());
    }
    await Promise.all(ordersPromises);
  }
  return orders;
}

async function generateTinyInvoice(order:OrderModel) {
  const { tinyOrderId } = order;
  if (!tinyOrderId) return;

  const invoice = await fetchTinyInvoiceCreate(tinyOrderId);
  console.log('Create invoice', JSON.stringify(invoice, null, 2));
  if (!invoice.retorno.registros?.registro) return;
  const { idNotaFiscal, numero } = invoice.retorno.registros.registro;
  order.invoiceId = idNotaFiscal;
  order.invoiceNumber = numero;
  await order.save();
  return idNotaFiscal;
}

async function emitTinyInvoice(idNotaFiscal: number, order: OrderModel) {
  const invoiceEmit = await fetchTinyInvoiceEmit(idNotaFiscal);
  console.log('Emit invoice', JSON.stringify(invoiceEmit, null, 2));
  order.invoiceStatus = Number(invoiceEmit.retorno?.status_processamento);
  order.invoiceUrl = invoiceEmit.retorno.nota_fiscal?.link_acesso;
  await order.save();
}

export async function createTinyOrdersTask() {
  const orders = await getAllOrdersToTiny();
  if (orders.length === 0) return;

  // Add or update tiny user
  const ordersUpdated = await createOrUpdateTinyUser(orders);

  console.log(JSON.stringify(ordersUpdated, null, 2));

  // Create tiny order
  ordersUpdated.forEach(async (order) => {
    await createTinyOrder(order);
  });
}

async function createTinyInvoice(orders:OrderModel[]) {
  updateTinyUser(orders);

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
}
