/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */

import OrderModel from '../database/models/OrderModel';
import { TinyClient } from '../interfaces';

export default class TinyClientClass implements TinyClient {
  nome?: string;
  email?: string;
  tipo_pessoa: string;
  cpf_cnpj?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  uf?: string;

  constructor(order:OrderModel) {
    this.nome = order.user.name;
    this.email = order.user.email;
    this.tipo_pessoa = 'F';
    this.cpf_cnpj = order.user.cpf;
    this.endereco = order.address;
    this.numero = order.number;
    this.complemento = order.complement;
    this.bairro = order.neighborhood;
    this.cidade = order.city;
    this.cep = order.postalCode;
    this.uf = order.state;
  }
}
