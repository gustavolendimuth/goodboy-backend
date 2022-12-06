import { Model, STRING, UUID } from "sequelize";
import db from './';

class UserModel extends Model {
  declare id: string
  declare email: string
  declare name: string
  declare password: string
}

UserModel.init({
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  email: STRING,
  password: STRING
}, 
{
  underscored: true,
  modelName: 'users',
  sequelize: db,
  timestamps: true,
  freezeTableName: true
})

export default UserModel;