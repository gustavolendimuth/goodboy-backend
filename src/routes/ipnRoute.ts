import express from 'express';
import { ipnController } from '../controllers/ipnController';

const ipnRouter = express.Router();

ipnRouter.post('/', ipnController);

export default ipnRouter;
