import { Model, STRING, BIGINT, UUID, DECIMAL } from 'sequelize';
import db from '.';
import ItemsModel from './ItemsModel';
import UserModel from './UserModel';

class OrderModel extends Model {
  declare id: string;
  declare userId: string;
  declare paymentId: number;
  declare preferenceId: number;
  declare totalAmount: number;
  declare feeAmount: number;
  declare paymentMethod: string;
  declare status: string;
}

OrderModel.init(
  {
    id: {
      type: UUID,
      primaryKey: true,
      allowNull: false,
    },
    preferenceId: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    paymentId: {
      type: BIGINT,
      unique: true,
    },
    totalAmount: DECIMAL,
    feeAmount: DECIMAL,
    netReceivedAmount: DECIMAL,
    paymentMethod: STRING,
    status: {
      type: STRING,
      defaultValue: 'pending',
    },
  },
  {
    underscored: true,
    modelName: 'orders',
    sequelize: db,
    timestamps: true,
    freezeTableName: true,
  },
);

UserModel.hasMany(OrderModel);
OrderModel.belongsTo(UserModel, { foreignKey: 'userId' });
OrderModel.hasMany(ItemsModel);
ItemsModel.belongsTo(OrderModel, { foreignKey: 'orderId' });

export default OrderModel;
