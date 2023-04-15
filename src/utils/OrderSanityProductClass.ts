import { Item, SanityProduct } from '../interfaces';

export default class OrderSanityProductClass implements Item {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  image?: string;

  constructor(item:SanityProduct) {
    this.productId = item.id;
    this.title = item.title;
    this.quantity = Number(item.quantity);
    this.unitPrice = Number(item.price);
    this.image = item.image;
  }
}
