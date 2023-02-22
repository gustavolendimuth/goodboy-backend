import express from 'express';
import { getAllOrders } from '../controllers/ordersController';

const ordersRouter = express.Router();

ordersRouter.get('/', getAllOrders);

export default ordersRouter;
