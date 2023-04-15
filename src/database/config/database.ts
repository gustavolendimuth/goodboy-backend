import 'dotenv/config';
import { Options } from 'sequelize';

const config: Options = {
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'goodboy',
  database: process.env.MYSQLDATABASE || 'goodboy',
  host: process.env.MYSQLHOST_CONTAINER || process.env.MYSQLHOST || 'localhost',
  port: Number(process.env.MYSQLPORT) || 3306,
  dialect: 'mysql',
  // dialectOptions: {
  //   timezone: 'Z',
  // },
  // logging: false,
};

export = config;