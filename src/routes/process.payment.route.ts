import express from 'express';
import { processPayment } from '../controllers/process.payment.controller';

const processPaymentRouter = express.Router();

processPaymentRouter.post('/', processPayment);

export default processPaymentRouter;