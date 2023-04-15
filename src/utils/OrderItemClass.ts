import { Item, MercadoPagoItem } from '../interfaces';

export default class OrderItemClass implements Item {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  ncm?: string;
  image?: string;

  constructor(item:MercadoPagoItem) {
    this.productId = item.id.toString();
    this.title = item.title;
    this.quantity = Number(item.quantity);
    this.unitPrice = Number(item.unit_price);
    this.ncm = item.ncm;
    this.image = item.image;
  }
}
