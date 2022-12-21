"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrder = void 0;
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    id: joi_1.default.string().length(36),
    status: joi_1.default.string().required(),
    payedAmount: joi_1.default.number().min(1).required(),
    paymentMethod: joi_1.default.string().required(),
    paymentId: joi_1.default.number().required(),
    feeAmount: joi_1.default.number().required(),
    userId: joi_1.default.string().length(36),
    user: joi_1.default.object({
        id: joi_1.default.string().length(36),
        email: joi_1.default.string().email().required(),
        name: joi_1.default.string().min(3).required(),
    }),
    items: joi_1.default.array().items(joi_1.default.object({
        productId: joi_1.default.string().length(36).required(),
        title: joi_1.default.string().required(),
        quantity: joi_1.default.number().min(1).required(),
        unitPrice: joi_1.default.number().min(1).required(),
        description: joi_1.default.string(),
    })).required(),
});
const validateOrder = (body) => {
    const { error } = schema.validate(body);
    if (error) {
        const err = error;
        err.statusCode = 400;
        throw err;
    }
};
exports.validateOrder = validateOrder;
