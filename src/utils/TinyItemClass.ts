/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import ItemsModel from '../database/models/ItemsModel';
import { TinyItem } from '../interfaces';

export default class TinyItemClass implements TinyItem {
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: string;
  valor_unitario: string;

  constructor(item:ItemsModel) {
    this.codigo = item.productId;
    this.descricao = item.title;
    this.unidade = 'UN';
    this.quantidade = item.quantity.toString();
    this.valor_unitario = item.unitPrice.toString();
  }
}
