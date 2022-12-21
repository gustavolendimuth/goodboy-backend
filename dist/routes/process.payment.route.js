"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const process_payment_controller_1 = require("../controllers/process.payment.controller");
const processPaymentRouter = express_1.default.Router();
processPaymentRouter.post('/', process_payment_controller_1.processPayment);
exports.default = processPaymentRouter;
