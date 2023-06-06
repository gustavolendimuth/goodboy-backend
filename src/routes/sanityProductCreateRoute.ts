import express from 'express';
import { sanityProductCreateController } from '../controllers/sanityProductCreateController';

const sanityProductCreateRouter = express.Router();

sanityProductCreateRouter.post('/', sanityProductCreateController);

export default sanityProductCreateRouter;
