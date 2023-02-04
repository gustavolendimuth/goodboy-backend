import express from 'express';
import { processPayment } from '../controllers/processPaymentController';

const processPaymentRouter = express.Router();

processPaymentRouter.post('/', processPayment);

export default processPaymentRouter;