"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const orderRouter = express_1.default.Router();
orderRouter.get('/:id', order_controller_1.getOrder);
orderRouter.post('/', order_controller_1.createOrder);
orderRouter.get('/', order_controller_1.getOrders);
exports.default = orderRouter;
