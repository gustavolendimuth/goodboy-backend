import express from 'express';
import { sanityProductUpdateController, sanityProductCreateController } from '../controllers/sanityProductController';

const sanityProductRouter = express.Router();

sanityProductRouter.post('/', sanityProductCreateController);
sanityProductRouter.put('/', sanityProductUpdateController);

export default sanityProductRouter;
