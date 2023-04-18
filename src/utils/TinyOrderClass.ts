/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import OrderModel from '../database/models/OrderModel';
import { TinyClient, TinyOrder, TinyItem } from '../interfaces';
import TinyClientClass from './TinyClientClass';
import TinyItemClass from './TinyItemClass';

const paymentMethod:{ [key: string]: string } = {
  credit_card: 'credito',
  debit_card: 'debito',
  boleto: 'boleto',
  pix: 'pix',
  account_money: 'debito',
};

export default class TinyOrderClass implements TinyOrder {
  cliente: TinyClient;
  itens: { item: TinyItem }[];
  forma_pagamento: string;
  meio_pagamento: 'Mercado Pago' | 'Brix Mercado Pago';
  frete_por_conta: 'S';
  numero_pedido_ecommerce: number;
  situacao: 'Entregue';

  constructor(order:OrderModel) {
    this.cliente = new TinyClientClass(order);
    this.itens = order.items.map((item, index) => ({ item: new TinyItemClass(item, index) }));
    this.forma_pagamento = paymentMethod[order.paymentMethod || 'credito'];
    this.meio_pagamento = order.paymentMethod ? 'Mercado Pago' : 'Brix Mercado Pago';
    this.frete_por_conta = 'S';
    this.numero_pedido_ecommerce = order.id || 0;
    this.situacao = 'Entregue';
  }
}
