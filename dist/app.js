"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const login_route_1 = __importDefault(require("./routes/login.route"));
const user_router_1 = __importDefault(require("./routes/user.router"));
// import authMiddleware from './middlewares/auth.middleware';
const order_route_1 = __importDefault(require("./routes/order.route"));
const orders_route_1 = __importDefault(require("./routes/orders.route"));
const cors_1 = __importDefault(require("cors"));
const process_payment_route_1 = __importDefault(require("./routes/process.payment.route"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/login', login_route_1.default);
app.use('/user', user_router_1.default);
app.use('/process_payment', process_payment_route_1.default);
// app.use(authMiddleware)
app.use('/order', order_route_1.default);
app.use('/orders', orders_route_1.default);
app.use(error_middleware_1.default);
exports.default = app;
