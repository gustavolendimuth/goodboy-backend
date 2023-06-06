import express from 'express';
import { sanityProductUpdateController } from '../controllers/sanityProductUpdateController';

const sanityProductUpdateRouter = express.Router();

sanityProductUpdateRouter.post('/', sanityProductUpdateController);
