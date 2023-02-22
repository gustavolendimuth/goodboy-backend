import express, { Request, Response } from 'express';
import loginRouter from './loginRoute';
import userRouter from './userRouter';
import orderRouter from './orderRoute';
import ordersRouter from './ordersRoute';
import preferenceRouter from './preferenceRoute';
import authMiddleware from '../middlewares/authMiddleware';
import processPaymentRouter from './processPayment.route';
import webhookRouter from './webhookRoute';
import ipnRouter from './ipnRoute';

const router = express.Router();

router.get('/', (_req:Request, res:Response) => res.send('Good Boy API'));

// app.use('/validate_token', loginRouter);
router.use('/user', userRouter);
router.use('/preference', preferenceRouter);
router.use('/process_payment', processPaymentRouter);
router.use('/webhook', webhookRouter);
router.use('/ipn', ipnRouter);
router.use('/login', loginRouter);
router.use('/order', orderRouter);
router.use(authMiddleware);
router.use('/orders', ordersRouter);

export default router;
