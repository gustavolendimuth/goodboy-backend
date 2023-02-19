import app from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, async () => {
  console.log(`-> Listening on port ${PORT}...\n`);
});

export default server;
