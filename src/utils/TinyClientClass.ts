/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import OrderModel from '../database/models/OrderModel';
import { TinyClient } from '../interfaces';

export default class TinyClientClass implements TinyClient {
  sequencia: number;
  situacao: string;
  id?: number;
  nome?: string;
  email?: string;
  tipo_pessoa: string;
  cpf_cnpj?: string;
  endereco?: string | null;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  uf?: string;

  constructor(order:OrderModel, index:number) {
    this.sequencia = index + 1;
    this.situacao = 'A';
    this.id = order.user.tinyClientId;
    this.nome = order.user.name || order.user.email?.split('@')[0];
    this.email = order.user.email;
    this.tipo_pessoa = 'F';
    this.cpf_cnpj = order.user.cpf;
    this.endereco = order.user.address;
    this.numero = order.user.number;
    this.complemento = order.user.complement;
    this.bairro = order.user.neighborhood;
    this.cidade = order.user.city;
    this.cep = order.user.postalCode;
    this.uf = order.user.state;
  }
}
