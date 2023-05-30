import { Model, STRING, BIGINT, DECIMAL, INTEGER } from 'sequelize';
import db from '.';
import ItemsModel from './ItemsModel';
import { Order } from '../../interfaces';
import UserModel from './UserModel';

class OrderModel extends Model<Order> implements Order {
  public id?: number;
  public user!: UserModel;
  public items!: ItemsModel[];
  public userId?: number;
  public paymentId?: number;
  public totalAmount?: number;
  public feeAmount?: number;
  public netReceivedAmount?: number;
  public paymentMethod?: string;
  public status?: string;
  public address?: string | null;
  public number?: string;
  public complement?: string;
  public neighborhood?: string;
  public postalCode?: string;
  public city?: string;
  public state?: string;
  public tinyOrderId?: number | null;
  public invoiceId: number | null | undefined;
  public invoiceStatus?: number | null;
  public invoiceNumber?: number | null | undefined;
  public invoiceUrl?: string;
}

OrderModel.init(
  {
    id: {
      allowNull: false,
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    paymentId: {
      type: BIGINT,
      unique: true,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    totalAmount: DECIMAL,
    feeAmount: DECIMAL,
    netReceivedAmount: DECIMAL,
    paymentMethod: STRING,
    status: {
      type: STRING,
      defaultValue: 'pending',
    },
    address: STRING,
    number: STRING,
    complement: STRING,
    neighborhood: STRING,
    postalCode: STRING,
    city: {
      type: STRING,
      defaultValue: 'São Paulo',
    },
    state: {
      type: STRING,
      defaultValue: 'SP',
    },
    tinyOrderId: INTEGER,
    invoiceStatus: INTEGER,
    invoiceId: {
      type: INTEGER,
      allowNull: true,
    },
    invoiceNumber: {
      type: INTEGER,
      allowNull: true,
    },
    invoiceUrl: STRING,
  },
  {
    underscored: true,
    modelName: 'orders',
    sequelize: db,
    timestamps: true,
    freezeTableName: true,
  },
);

UserModel.hasMany(OrderModel, { foreignKey: 'userId', as: 'orders' });
OrderModel.belongsTo(UserModel, { foreignKey: 'userId' });
OrderModel.hasMany(ItemsModel, { foreignKey: 'orderId', as: 'items' });
ItemsModel.belongsTo(OrderModel, { foreignKey: 'orderId' });

export default OrderModel;
