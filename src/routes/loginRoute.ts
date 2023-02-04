import express from 'express';
import login from '../controllers/loginController';

const loginRouter = express.Router();

loginRouter.post('/', login);

export default loginRouter;