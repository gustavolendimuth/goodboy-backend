import express from 'express';
import { createOrder, getOrder, getOrders } from '../controllers/order.controller';

const orderRouter = express.Router();

orderRouter.get('/:id', getOrder);
orderRouter.post('/', createOrder);
orderRouter.get('/', getOrders)

export default orderRouter;