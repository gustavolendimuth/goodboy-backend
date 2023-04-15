import express from 'express';
import invoiceController from '../controllers/invoiceController';

const invoiceRouter = express.Router();

invoiceRouter.post('/', invoiceController);

export default invoiceRouter;
