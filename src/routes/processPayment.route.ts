import express from 'express';
import { processPayment, processPaymentUpdate } from '../controllers/processPaymentController';

const processPaymentRouter = express.Router();

processPaymentRouter.post('/', processPayment);
processPaymentRouter.put('/', processPaymentUpdate);

export default processPaymentRouter;
