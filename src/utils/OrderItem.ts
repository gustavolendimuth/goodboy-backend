import { Item, MercadoPagoItem } from '../interfaces';

export default class OrderItem implements Item {
  productId: number;
  title: string;
  quantity: number;
  unitPrice: number;

  constructor(item:MercadoPagoItem) {
    this.productId = item.id;
    this.title = item.title;
    this.quantity = Number(item.quantity);
    this.unitPrice = Number(item.unit_price);
  }
}
