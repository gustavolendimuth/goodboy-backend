/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { SanityProduct, TinyProduct } from '../interfaces';

export default class SanityProductClass implements TinyProduct {
  sequencia: string;
  codigo: string;
  nome: string;
  unidade: string;
  preco: string;
  ncm: string;
  origem: string;
  situacao: string;
  tipo: string;
  anexos: [{ anexo: string }];

  constructor(item:SanityProduct) {
    this.sequencia = '1';
    this.codigo = item._id;
    this.nome = item.title;
    this.unidade = 'UN';
    this.preco = item.price.toString();
    this.ncm = item.ncm;
    this.origem = '0';
    this.situacao = 'A';
    this.tipo = 'P';
    this.anexos = [{ anexo: item.image }];
  }
}
