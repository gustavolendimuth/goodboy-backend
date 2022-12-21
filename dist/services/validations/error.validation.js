"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateError = void 0;
const validateError = (error) => {
    let errorMessage = 'Unknown error cause';
    let errorStatus = 400;
    if (error.cause) {
        const sdkErrorMessage = error.cause[0].description;
        errorMessage = sdkErrorMessage || errorMessage;
        const sdkErrorStatus = error.status;
        errorStatus = sdkErrorStatus || errorStatus;
    }
    return { errorMessage, errorStatus };
};
exports.validateError = validateError;
