import 'express-async-errors';
import express from 'express';
import errorMiddleware from './middlewares/error.middleware';
import loginRouter from './routes/login.route';
import userRouter from './routes/user.router';
// import authMiddleware from './middlewares/auth.middleware';
import orderRouter from './routes/order.route';
import ordersRouter from './routes/orders.route';
import cors from 'cors';
import processPaymentRouter from './routes/process.payment.route';

// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/process_payment', processPaymentRouter);
// app.use(authMiddleware)
app.use('/order', orderRouter);
app.use('/orders', ordersRouter);

app.use(errorMiddleware);

export default app;