import express, { Request, Response } from 'express';
import loginRouter from './loginRoute';
import userRouter from './userRouter';
import orderRouter from './orderRoute';
import ordersRouter from './ordersRoute';
import preferenceRouter from './preferenceRoute';
import authMiddleware from '../middlewares/authMiddleware';
import processPaymentRouter from './processPayment.route';
import webhookRouter from './webhookRoute';

const router = express.Router();

router.get('/', (_req:Request, res:Response) => res.send('Good Boy API'));

router.use('/login', loginRouter);
// app.use('/validate_token', loginRouter);
router.use('/user', userRouter);
router.use('/process_payment', processPaymentRouter);
router.use('/webhook', webhookRouter);
router.use('/preference', preferenceRouter);
router.use('/order', orderRouter);
router.use(authMiddleware);
router.use('/orders', ordersRouter);

export default router;
