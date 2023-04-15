/* eslint-disable import/no-cycle */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Model, INTEGER, STRING, DECIMAL, UUID } from 'sequelize';
import db from '.';
import { Item } from '../../interfaces';

class ItemsModel extends Model<Item> implements Item {
  declare id: number;
  declare productId: string;
  declare title: string;
  declare quantity: number;
  declare unitPrice: number;
  declare description: string;
  declare orderId: number;
  declare ncm: string;
  declare image: string;
}

ItemsModel.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: UUID,
      allowNull: false,
    },
    title: {
      type: STRING,
      allowNull: false,
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DECIMAL,
      allowNull: false,
    },
    orderId: {
      type: INTEGER,
      allowNull: false,
    },
    ncm: {
      type: STRING,
      allowNull: false,
    },
    image: STRING,
  },
  {
    underscored: true,
    modelName: 'items',
    sequelize: db,
    timestamps: false,
    freezeTableName: true,
  },
);

export default ItemsModel;
