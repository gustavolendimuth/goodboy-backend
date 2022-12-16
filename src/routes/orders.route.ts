import express from 'express';
import { getAllOrders } from '../controllers/orders.controller';

const ordersRouter = express.Router();

ordersRouter.get('/', getAllOrders)

export default ordersRouter;