import { Item, MercadoPagoItem } from '../interfaces';

export default class OrderItemClass implements Item {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  ncm?: string;
  description?: string;
  image?: string;
  originCode?: number;
  slug?: string;

  constructor(item:MercadoPagoItem) {
    this.productId = item.id.toString();
    this.title = item.title;
    this.description = item.description;
    this.quantity = Number(item.quantity);
    this.unitPrice = Number(item.unit_price);
    this.image = item.image;
    this.originCode = item.originCode;
    this.slug = item.slug;
    this.ncm = item.ncm;
  }
}
