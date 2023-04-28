import express, { Request, Response } from 'express';
import loginRouter from './loginRoute';
import userRouter from './userRouter';
import orderRouter from './orderRoute';
import ordersRouter from './ordersRoute';
import preferenceRouter from './preferenceRoute';
import authMiddleware from '../middlewares/authMiddleware';
import processPaymentRouter from './processPaymentRoute';
import webhookRouter from './webhookRoute';
import ipnRouter from './ipnRoute';
import invoiceRouter from './invoiceRoute';
import tinyOrderRouter from './tinyOrderRoute';
import paymentRouter from './paymentRoute';
import validateToken from '../middlewares/validateToken';

const router = express.Router();

router.get('/', (_req:Request, res:Response) => res.send('Good Boy API'));

router.use('/webhook', webhookRouter);
router.use('/ipn', ipnRouter);
router.use(validateToken);
router.use('/invoice', invoiceRouter);
router.use('/tiny_order', tinyOrderRouter);
router.use('/user', userRouter);
router.use('/preference', preferenceRouter);
router.use('/process_payment', processPaymentRouter);
router.use('/login', loginRouter);
router.use('/payment', paymentRouter);
router.use('/order', orderRouter);
router.use(authMiddleware);
router.use('/orders', ordersRouter);

export default router;
