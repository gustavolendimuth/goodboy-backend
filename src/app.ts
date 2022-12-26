import 'express-async-errors';
import express, { Request, Response } from 'express';
import errorMiddleware from './middlewares/error.middleware';
import loginRouter from './routes/login.route';
import userRouter from './routes/user.router';
import authMiddleware from './middlewares/auth.middleware';
import orderRouter from './routes/order.route';
import ordersRouter from './routes/orders.route';
import cors from 'cors';
import processPaymentRouter from './routes/process.payment.route';

const corsOptions = {
  origin: ['http://localhost:3000', process.env.FRONTEND_URL || ''],
  optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (_req:Request, res:Response) => res.send('Good Boy API'));
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/process_payment', processPaymentRouter);
app.use(authMiddleware)
app.use('/order', orderRouter);
app.use('/orders', ordersRouter);

app.use(errorMiddleware);

export default app;