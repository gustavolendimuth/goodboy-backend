"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};
