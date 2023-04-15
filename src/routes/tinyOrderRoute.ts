import express from 'express';
import { tinyOrderController } from '../controllers/tinyOrderController';

const tinyOrderRouter = express.Router();

tinyOrderRouter.post('/', tinyOrderController);

export default tinyOrderRouter;
