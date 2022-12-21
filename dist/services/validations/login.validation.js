"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateLogin = (body) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email()
            .messages({
            'any.required': '"email" is required',
            'string.empty': '"email" is required',
            'string.email': 'email inválido'
        }),
        magicLink: joi_1.default.string().length(36),
        token: joi_1.default.string(),
    });
    const { error, value } = schema.validate(body);
    const err = error;
    if (err) {
        err.statusCode = 400;
        throw err;
    }
    return value;
};
exports.default = validateLogin;
