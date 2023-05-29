import 'express-async-errors';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import { CronJob } from 'cron';

import { errorMiddleware } from './middlewares/errorMiddleware';
import router from './routes/routes';
import { createTinyInvoiceTask, createTinyOrdersTask } from './services/tinyOrderService';

const task1 = new CronJob('1-59/2 * * * *', () => {
  createTinyOrdersTask().catch((error) => {
    console.error('Error in createTinyOrdersTask:', error);
  });
});

const task2 = new CronJob('0-58/2 * * * *', () => {
  createTinyInvoiceTask().catch((error) => {
    console.error('Error in createTinyInvoiceTask:', error);
  });
});

task1.start();
task2.start();

const corsOptions:CorsOptions = {
  origin: process.env.FRONTEND_URL || '',
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use(router);

app.use(errorMiddleware);

export default app;
