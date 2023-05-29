import { INTEGER, Model, STRING, UUIDV4, BOOLEAN } from 'sequelize';
import db from '.';
import { IUser } from '../../interfaces';

class UserModel extends Model<IUser> implements IUser {
  declare id?: number;
  declare tinyClientId?: number;
  declare email?: string;
  declare name?: string;
  declare cpf?: string;
  declare role?: string;
  declare address?: string;
  declare number?: string;
  declare complement?: string;
  declare neighborhood?: string;
  declare postalCode?: string;
  declare city?: string;
  declare state?: string;
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
    tinyClientId: {
      type: INTEGER,
      allowNull: true,
    },
    name: {
      type: STRING,
      allowNull: true,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
    cpf: STRING,
    address: STRING,
    number: STRING,
    complement: STRING,
    neighborhood: STRING,
    postalCode: STRING,
    city: STRING,
    state: STRING,
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
