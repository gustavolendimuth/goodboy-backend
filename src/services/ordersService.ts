/* eslint-disable max-lines-per-function */
/* eslint-disable import/prefer-default-export */
import sequelize from 'sequelize';
import ItemsModel from '../database/models/ItemsModel';
import OrderModel from '../database/models/OrderModel';
import UserModel from '../database/models/UserModel';

export const getAllOrdersToInvoice = async () => OrderModel.findAll({
  where: {
    [sequelize.Op.or]: [
      { invoiceId: { [sequelize.Op.is]: null } },
      { invoiceNumber: { [sequelize.Op.is]: null } },
    ],
    address: { [sequelize.Op.not]: null },
  },
  include: [
    {
      model: ItemsModel,
      as: 'items',
      attributes: {
        exclude: ['orderId'],
      },
    },
    {
      model: UserModel,
      as: 'user',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'magicLink', 'magicLinkExpired'],
      },
    },
  ],
  attributes: { exclude: ['userId'] },
});

export const getAllOrdersToTiny = async () => OrderModel.findAll({
  where: {
    tinyOrderId: { [sequelize.Op.is]: null },
    status: 'approved',
  },
  include: [
    {
      model: ItemsModel,
      as: 'items',
      attributes: {
        exclude: ['orderId'],
      },
    },
    {
      model: UserModel,
      as: 'user',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'magicLink', 'magicLinkExpired'],
      },
    },
  ],
  attributes: { exclude: ['userId'] },
});
