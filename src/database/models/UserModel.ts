import { Model, STRING, UUIDV4, BOOLEAN } from "sequelize";
import db from './';

class UserModel extends Model {
  declare id: string;
  declare email: string;
  declare name: string;
  declare magicLink: string;
  declare magicLinkExpired: boolean;
  declare role: string;
}

UserModel.init({
  id: {
    type: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  email: STRING,
  magicLink: {
    type: UUIDV4,
    allowNull: true,
  },
  magicLinkExpired: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  role: {
    type: STRING,
    allowNull: false,
    defaultValue: 'user'
  }
},
{
  underscored: true,
  modelName: 'users',
  sequelize: db,
  timestamps: true,
  freezeTableName: true
})

export default UserModel;