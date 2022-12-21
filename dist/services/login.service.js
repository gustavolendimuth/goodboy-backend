"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/* eslint-disable @typescript-eslint/no-unused-vars */
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const jwtUtils_1 = require("../utils/jwtUtils");
const login_validation_1 = __importDefault(require("./validations/login.validation"));
const uuid_1 = require("uuid");
const sendMagicLink_1 = __importDefault(require("../utils/sendMagicLink"));
const throwError_1 = __importDefault(require("../utils/throwError"));
const jwtUtils = __importStar(require("../utils/jwtUtils"));
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    (0, login_validation_1.default)(body);
    const { email, magicLink, token } = body;
    if (token) {
        jwtUtils.validateToken(token);
        return { message: 'Login efetuado com sucesso' };
    }
    let err;
    const newMagicLink = (0, uuid_1.v4)();
    const response = yield UserModel_1.default.findOne({ where: { email } });
    if (!response) {
        (0, throwError_1.default)(401, 'Nenhuma compra realizada com este email');
        return;
    }
    if (!magicLink) {
        response.set({ magicLink: newMagicLink, magicLinkExpired: false });
        yield response.save();
        (0, sendMagicLink_1.default)(email, newMagicLink).catch((e) => console.log(e));
        return { message: `Email com link de login enviado para ${email}` };
    }
    if (response.magicLinkExpired || response.magicLink !== magicLink) {
        (0, throwError_1.default)(401, 'Link de login expirado. Faça login novamente');
    }
    response.set({ magicLinkExpired: true });
    yield response.save();
    const result = (0, jwtUtils_1.createToken)({ name: response.name, email: response.email, role: response.role, id: response.id });
    return { token: result };
});
exports.default = login;
