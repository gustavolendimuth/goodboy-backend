"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string(),
    magicLink: joi_1.default.string().length(36),
});
const validateUser = (body) => {
    const { error, value } = schema.validate(body);
    const err = error;
    if (err) {
        const errType = err.details[0].type;
        const errCode = {
            'string.base': 422,
            'any.required': 400,
            'string.empty': 400,
            'string.min': 422,
            'string.email': 422,
            'number.base': 422,
            'number.empty': 400,
            'number.min': 422,
        };
        err.statusCode = errCode[errType];
        throw err;
    }
};
exports.default = validateUser;
