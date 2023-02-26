/* eslint-disable max-params */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Order, IUser, OrderParams, Item } from '../interfaces';

export default class OrderClass implements Order {
  id?: string;
  items?: Item[];
  status?: string;
  totalAmount?: number;
  netReceivedAmount?: number;
  paymentMethod?: string;
  paymentId?: number;
  feeAmount?: number;
  user?: IUser;
  userId?: string;

  constructor(params:OrderParams) {
    this.id = params.id;
    this.items = params.itemsData;
    this.status = params.orderData?.status || 'created';
    this.totalAmount = params.orderData?.transaction_details?.total_paid_amount;
    this.netReceivedAmount = params.orderData?.transaction_details?.net_received_amount;
    this.paymentMethod = params.orderData?.payment_type_id === 'bank_transfer'
      ? params.orderData?.payment_method_id : params.orderData?.payment_type_id;
    this.paymentId = params.orderData?.id;
    this.feeAmount = params.orderData?.fee_details && params.orderData.fee_details[0]?.amount;
    this.user = params.user;
    this.userId = params.userId;
  }
}
