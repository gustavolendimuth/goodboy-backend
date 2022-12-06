import express from 'express';
import { createOrder, getOrder } from '../controllers/order.controller';
import { getAllOrders } from '../controllers/order.controller';

const orderRouter = express.Router();

orderRouter.get('/:id', getOrder);
orderRouter.post('/', createOrder);
orderRouter.get('/', getAllOrders)

export default orderRouter;