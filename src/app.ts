import 'express-async-errors';
import express from 'express';
import cors, { CorsOptions } from 'cors';

import { errorMiddleware } from './middlewares/errorMiddleware';
import router from './routes/routes';

const corsOptions:CorsOptions = {
  origin: [process.env.FRONTEND_URL || ''],
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use(router);

app.use(errorMiddleware);

export default app;
