import 'dotenv/config';
import { Options } from 'sequelize';

const config: Options = {
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'goodboy',
  database: process.env.MYSQLDATABASE || 'goodboy',
  host: process.env.MYSQLHOST_CONTAINER || process.env.MYSQLHOST || 'localhost',
  port: Number(process.env.MYSQLPORT) || 3306,
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
  dialectOptions: {
    timezone: '-03:00',
  },
  logging: false,
};

export = config;