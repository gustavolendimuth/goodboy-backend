"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const userRouter = express_1.default.Router();
userRouter.get('/', auth_middleware_1.default, user_controller_1.getUser);
userRouter.post('/', user_controller_1.createUser);
exports.default = userRouter;
