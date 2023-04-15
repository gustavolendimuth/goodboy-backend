import express from 'express';
import { createOrder, getOrder, getOrders } from '../controllers/orderController';
// import authMiddleware from '../middlewares/authMiddleware';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
// orderRouter.use(authMiddleware);
orderRouter.get('/:id', getOrder);
orderRouter.get('/', getOrders);

export default orderRouter;
