import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})

export default server;