import { Model, INTEGER, STRING, DECIMAL, UUID } from "sequelize";
import db from '.';

class ItemsModel extends Model {
  declare id: number;
  declare productId: string;
  declare title: string;
  declare quantity: number;
  declare unit_price: number;
  declare description: string;
  declare orderId: string;
}

ItemsModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: UUID,
    allowNull: false
  },
  title: STRING,
  quantity: INTEGER,
  unitPrice: DECIMAL,
  orderId: {
    type: UUID
  }
}, 
{
  underscored: true,
  modelName: 'items',
  sequelize: db,
  timestamps: false,
  freezeTableName: true
})

export default ItemsModel;