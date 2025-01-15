import 'express-async-errors';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import { CronJob } from 'cron';

import { errorMiddleware } from './middlewares/errorMiddleware';
import router from './routes/routes';
import { createTinyInvoiceTask, createTinyOrdersTask } from './services/tinyTasksService';

const task1 = new CronJob('1-59/2 * * * *', async () => {
  const maxRetries = 3;
  let retries = 0;
  
  const runTask = async () => {
    try {
      await createTinyOrdersTask();
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        console.error(`Error in createTinyOrdersTask (attempt ${retries}/${maxRetries}):`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        await runTask();
      } else {
        console.error('Max retries reached for createTinyOrdersTask:', error);
        // Adicionar notificação/alerta aqui
      }
    }
  };
  
  await runTask();
});

// const task1 = new CronJob('1-59/2 * * * *', () => {
//   createTinyOrdersTask().catch((error) => {
//     console.error('Error in createTinyOrdersTask:', error);
//   });
// });

const task2= new CronJob('1-58/2 * * * *', async () => {
  const maxRetries = 3;
  let retries = 0;
  
  const runTask = async () => {
    try {
      await createTinyInvoiceTask();
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        console.error(`Error in createTinyOrdersTask (attempt ${retries}/${maxRetries}):`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        await runTask();
      } else {
        console.error('Max retries reached for createTinyOrdersTask:', error);
        // Adicionar notificação/alerta aqui
      }
    }
  };
  
  await runTask();
});

// const task2 = new CronJob('0-58/2 * * * *', () => {
//   createTinyInvoiceTask().catch((error) => {
//     console.error('Error in createTinyInvoiceTask:', error);
//   });
// });

task1.start();
task2.start();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

if (!process.env.FRONTEND_URL) {
  console.warn('FRONTEND_URL not set in environment variables');
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use(router);

app.use(errorMiddleware);

export default app;
