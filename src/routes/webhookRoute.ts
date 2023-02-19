import express from 'express';
import { webhook } from '../controllers/webhookController';

const webhookRouter = express.Router();

webhookRouter.post('/', webhook);

export default webhookRouter;
