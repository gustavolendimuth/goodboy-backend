/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import ItemsModel from '../database/models/ItemsModel';
import { TinyProduct } from '../interfaces';

export default class TinyProductClass implements TinyProduct {
  sequencia: string;
  codigo: string;
  nome: string;
  unidade: string;
  preco: string;
  ncm?: string;
  origem: string;
  situacao: string;
  tipo: string;
  seo: { slug: string };
  anexos: [{ anexo: string }];

  constructor(item:ItemsModel, index:number) {
    this.sequencia = index.toString();
    this.codigo = item.productId;
    this.nome = item.title;
    this.unidade = 'UN';
    this.preco = item.unitPrice.toString();
    this.ncm = item.ncm;
    this.origem = item.originCode.toString();
    this.situacao = 'A';
    this.tipo = 'P';
    this.seo = { slug: item.slug };
    this.anexos = [{ anexo: item.image }];
  }
}
