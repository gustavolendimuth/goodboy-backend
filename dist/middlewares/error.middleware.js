"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, _req, res, _next) => {
    const { statusCode, message } = err;
    console.log(err);
    return res.status(statusCode || 500).json({ message });
};
