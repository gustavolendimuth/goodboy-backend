"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = void 0;
const ItemsModel_1 = __importDefault(require("../database/models/ItemsModel"));
const OrderModel_1 = __importDefault(require("../database/models/OrderModel"));
// import { validateOrder } from './validations/order.validation';
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield OrderModel_1.default.findAll({
        attributes: { exclude: ['userId'] },
        include: [{ model: ItemsModel_1.default, attributes: { exclude: ['id', 'orderId'] } }],
    });
    if (!response) {
        const err = new Error("Order not found");
        err.statusCode = 401;
        throw err;
    }
    return response;
});
exports.getAllOrders = getAllOrders;
