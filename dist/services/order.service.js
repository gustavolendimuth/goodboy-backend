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
exports.getOrders = exports.getOrder = exports.createOrder = void 0;
const sequelize_1 = require("sequelize");
const ItemsModel_1 = __importDefault(require("../database/models/ItemsModel"));
const OrderModel_1 = __importDefault(require("../database/models/OrderModel"));
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
// import { validateOrder } from './validations/order.validation';
const createOrder = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // validateOrder(body);
    const response = yield OrderModel_1.default.create(Object.assign({}, body), {
        include: [ItemsModel_1.default, UserModel_1.default]
    });
    if (!response) {
        const err = new Error("Order not created");
        err.statusCode = 401;
        throw err;
    }
    return response;
});
exports.createOrder = createOrder;
const getOrder = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield OrderModel_1.default.findOne({
        where: {
            [sequelize_1.Op.and]: [
                { userId: (_a = body.login) === null || _a === void 0 ? void 0 : _a.data.id },
                { id: id }
            ]
        },
    });
    if (!response) {
        const err = new Error("Order not found");
        err.statusCode = 401;
        throw err;
    }
    return response;
});
exports.getOrder = getOrder;
const getOrders = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const response = yield OrderModel_1.default.findAll({
        attributes: { exclude: ['userId'] },
        where: { userId: (_b = body.login) === null || _b === void 0 ? void 0 : _b.data.id },
        include: [{ model: ItemsModel_1.default, attributes: { exclude: ['id', 'orderId'] } }],
    });
    if (!response) {
        const err = new Error("Order not found");
        err.statusCode = 401;
        throw err;
    }
    return response;
});
exports.getOrders = getOrders;
