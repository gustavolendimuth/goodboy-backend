import express from 'express';
import { ipn } from '../controllers/ipnController';

const ipnRouter = express.Router();

ipnRouter.post('/', ipn);

export default ipnRouter;
