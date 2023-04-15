import express from 'express';
import { webhookController } from '../controllers/webhookController';

const webhookRouter = express.Router();

webhookRouter.post('/', webhookController);

export default webhookRouter;
