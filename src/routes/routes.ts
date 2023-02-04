import express, { Request, Response } from 'express';
import loginRouter from './loginRoute';
import userRouter from './userRouter';
import orderRouter from './orderRoute';
import ordersRouter from './ordersRoute';
import processPaymentRouter from './processPayment.route';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();


router.get('/', (_req:Request, res:Response) => res.send('Good Boy API'));

router.use('/login', loginRouter);
// app.use('/validate_token', loginRouter);
router.use('/user', userRouter);
router.use('/process_payment', processPaymentRouter);
router.use('/order', orderRouter);
router.use(authMiddleware)
router.use('/orders', ordersRouter);

export default router;