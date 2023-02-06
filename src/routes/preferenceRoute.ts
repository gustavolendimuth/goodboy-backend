import express from 'express';
import preferenceController from '../controllers/preferenceController';

const preferenceRouter = express.Router();

preferenceRouter.post('/', preferenceController);

export default preferenceRouter;