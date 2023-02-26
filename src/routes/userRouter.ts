import express from 'express';
import { getUser } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const userRouter = express.Router();

userRouter.get('/', authMiddleware, getUser);
// userRouter.post('/', createUser);

export default userRouter;
