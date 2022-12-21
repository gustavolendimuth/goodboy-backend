"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (data) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
        throw new Error('JWT_SECRET not found');
    const token = jsonwebtoken_1.default.sign({ data }, jwtSecret, {
        expiresIn: '15d',
        algorithm: 'HS256',
    });
    return token;
};
exports.createToken = createToken;
const validateToken = (token) => {
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            throw new Error('JWT_SECRET not found');
        const response = jsonwebtoken_1.default.verify(token, jwtSecret);
        return response;
    }
    catch (e) {
        const err = new Error('Token inválido');
        err.statusCode = 401;
        throw err;
    }
};
exports.validateToken = validateToken;
