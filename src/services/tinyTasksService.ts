/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import OrderModel from '../database/models/OrderModel';
import errorLog from '../utils/errorLog';
import {
  fetchTinyInvoiceCreate,
  fetchTinyInvoiceEmit,
  // fetchTinyItemsCreate,
  fetchTinyOrderCreate,
  fetchTinyUserCreate,
  fetchTinyUserUpdate,
} from '../utils/fetchTinyData';
import { getAllOrdersToInvoice, getAllOrdersToTiny } from './ordersService';

async function updateTinyUser(orders: OrderModel[]) {
  if (orders.length === 0) return;
  const orderResult = await fetchTinyUserUpdate(orders);
  return orderResult.retorno.status;
}

async function createOrUpdateTinyUser(orders: OrderModel[]) {
  const createTinyUserResult = await updateTinyUser(orders);
  if (createTinyUserResult === 'Erro') {
    const clientResult = await fetchTinyUserCreate(orders);
    console.log('Tiny User Create Response:', JSON.stringify(clientResult, null, 2));

    if (!clientResult.retorno?.registros) {
      console.log('No registros in response');
      return orders;
    }

    const registros = Array.isArray(clientResult.retorno.registros) 
      ? clientResult.retorno.registros 
      : [clientResult.retorno.registros];

    const ordersPromises = orders.map((order, i) => {
      const registro = registros[i]?.registro;
      if (registro?.id) {
        order.user.tinyClientId = registro.id;
        return order.user.save();
      }
      console.log(`No registro.id for order ${i}`);
      return null;
    }).filter(Boolean);

    await Promise.all(ordersPromises);
  }
  return orders;
}

// async function createTinyItems(orders: OrderModel[]) {
//   await fetchTinyItemsCreate(orders);
// }

async function createTinyOrder(order: OrderModel) {
  if (order.tinyOrderId) return order.tinyOrderId;

  const orderResult = await fetchTinyOrderCreate(order);
  if (orderResult.retorno.status === 'Erro') return;

  const { id: tinyOrderId } = orderResult.retorno.registros.registro;
  order.tinyOrderId = tinyOrderId;
  await order.save();
  return tinyOrderId;
}

async function generateTinyInvoice(order: OrderModel) {
  const { tinyOrderId } = order;
  if (!tinyOrderId) return;

  const invoice = await fetchTinyInvoiceCreate(tinyOrderId);
  if (!invoice.retorno.registros?.registro) return;

  const { idNotaFiscal, numero } = invoice.retorno.registros.registro;
  order.invoiceId = idNotaFiscal;
  order.invoiceNumber = numero;
  await order.save();
  return idNotaFiscal;
}

async function emitTinyInvoice(idNotaFiscal: number, order: OrderModel) {
  const invoiceEmit = await fetchTinyInvoiceEmit(idNotaFiscal);

  order.invoiceStatus = Number(invoiceEmit.retorno?.status_processamento);
  order.invoiceUrl = invoiceEmit.retorno.nota_fiscal?.link_acesso;
  await order.save();
}

async function createTinyInvoice(orders: OrderModel[]) {
  await updateTinyUser(orders);

  const invoicePromises = orders.map(async (order) => {
    let { invoiceId: idNotaFiscal } = order;
    if (!idNotaFiscal) {
      idNotaFiscal = await generateTinyInvoice(order);
    }

    if ((!order.invoiceStatus || order.invoiceStatus !== 3) && idNotaFiscal) {
      await emitTinyInvoice(idNotaFiscal, order);
    }
  });

  await Promise.all(invoicePromises);
}

export async function createTinyOrdersTask() {
  try {
    const orders = await getAllOrdersToTiny();
    if (orders.length === 0) return;

    // Add or update tiny user
    const ordersUpdated = await createOrUpdateTinyUser(orders);

    // // Add tiny products
    // await createTinyItems(ordersUpdated);

    // Create tiny order
    const ordersPromises = ordersUpdated.map((order) => createTinyOrder(order));
    await Promise.all(ordersPromises);
  } catch (error: any) {
    errorLog({ error });
  }
}

export async function createTinyInvoiceTask() {
  try {
    const orders = await getAllOrdersToInvoice();

    if (!orders) return;

    await createTinyInvoice(orders);
  } catch (error: any) {
    errorLog({ error });
  }
}
