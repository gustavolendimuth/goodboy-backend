"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = () => {
    const { MERCADO_PAGO_PUBLIC_KEY, MERCADO_PAGO_ACCESS_TOKEN } = process.env;
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
        const err = new Error("Error: access token not defined");
        console.log(err);
        process.exit(1);
    }
    if (!MERCADO_PAGO_PUBLIC_KEY) {
        const err = new Error("Error: public key not defined");
        console.log(err);
        process.exit(1);
    }
};
