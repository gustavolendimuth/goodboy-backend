import { INTEGER, Model, STRING, UUIDV4, BOOLEAN } from 'sequelize';
import db from '.';
import { IUser } from '../../interfaces';

class UserModel extends Model<IUser> implements IUser {
  declare id?: number;
  declare email?: string;
  declare name?: string;
  declare cpf?: string;
  declare role?: string;
  declare magicLink?: string;
  declare magicLinkExpired?: boolean;
}

UserModel.init(
  {
    id: {
      allowNull: false,
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
    cpf: {
      type: STRING,
      allowNull: false,
    },
    magicLink: {
      type: UUIDV4,
      allowNull: true,
    },
    magicLinkExpired: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    underscored: true,
    modelName: 'users',
    sequelize: db,
    timestamps: true,
    freezeTableName: true,
  },
);

export default UserModel;
