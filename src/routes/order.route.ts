import express from 'express';
import { createOrder, getOrder, getOrders } from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.use(authMiddleware)
orderRouter.get('/:id', getOrder);
orderRouter.get('/', getOrders)

export default orderRouter;