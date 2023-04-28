import express from 'express';
import { paymentController } from '../controllers/paymentController';

const paymentRouter = express.Router();

paymentRouter.get('/:paymentId', paymentController);

export default paymentRouter;
