import { DECIMAL } from 'sequelize';
import { Model, STRING, INTEGER, UUID } from "sequelize";
import db from '.';
import ItemsModel from "./ItemsModel";
import UserModel from "./UserModel";

class OrderModel extends Model {
  declare id: string;
  declare userId: string;
  declare paymentId: number;
  declare payedAmount: number;
  declare feeAmount: number;
  declare paymentMethod: string;
  declare status: string;
}

OrderModel.init({
  id: {
    type: UUID,
    primaryKey: true,
    allowNull: false,
  },
  paymentId: {
    type: INTEGER,
    allowNull: false,
    unique: true
  },
  payedAmount: {
    type: DECIMAL,
    allowNull: false,
  },
  feeAmount: {
    type: DECIMAL,
    allowNull: false,
  },
  paymentMethod: {
    type: STRING,
    allowNull: false,
  },
  status: {
    type: STRING,
    allowNull: false,
    defaultValue: 'pending',
  }
}, 
{
  underscored: true,
  modelName: 'orders',
  sequelize: db,
  timestamps: true,
  freezeTableName: true
})

UserModel.hasMany(OrderModel);
OrderModel.belongsTo(UserModel, { foreignKey: 'userId' });
OrderModel.hasMany(ItemsModel);
ItemsModel.belongsTo(OrderModel, { foreignKey: 'orderId' });

export default OrderModel;