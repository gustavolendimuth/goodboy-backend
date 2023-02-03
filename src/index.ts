import app from './app';
import 'dotenv/config';
import sequelize from './database/models';
import { exit } from 'process';

const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('\n- Connection has been established successfully.\n');
  } catch (error) {
    console.error('\n- Unable to connect to the database\n');
    exit(0);
  }

  console.log(`- Listening on port ${PORT}...\n`)
})

export default server;