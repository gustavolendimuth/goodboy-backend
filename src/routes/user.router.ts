import express from 'express';
import { createUser, getUser } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.get('/', authMiddleware, getUser);
userRouter.post('/', createUser);

export default userRouter;