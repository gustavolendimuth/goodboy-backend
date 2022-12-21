"use strict";
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
exports.processPayment = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mercadopago_1 = __importDefault(require("mercadopago"));
const keys_validation_1 = __importDefault(require("./validations/keys.validation"));
const order_service_1 = require("./order.service");
const order_validation_1 = require("./validations/order.validation");
const users_service_1 = require("./users.service");
const uuid_1 = require("uuid");
const processPayment = (body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (0, keys_validation_1.default)();
    const mercadoPagoAccessToken = (_a = process.env.MERCADO_PAGO_ACCESS_TOKEN) !== null && _a !== void 0 ? _a : '';
    mercadopago_1.default.configurations.setAccessToken(mercadoPagoAccessToken);
    const { formData, items } = body;
    console.log(formData);
    const { payer: { email } } = formData;
    //   const preference = {
    //   // o "purpose": "wallet_purchase" permite apenas pagamentos logados
    //   // para permitir pagamentos como guest, você pode omitir essa propriedade
    //   "items": items,
    // };
    // mercadopago.preferences.create(preference)
    //   .then(function (response) {
    //     // Este valor é o preferenceId que será enviado para o Brick na inicialização
    //     const preferenceId = response.body.id;
    //   }).catch(function (error) {
    //     console.log(error);
    //   });
    return mercadopago_1.default.payment.save(formData)
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const { response: data } = response;
        // const email = data.payer.email;
        const name = email.split('@')[0];
        const user = { id: (0, uuid_1.v4)(), email, name };
        const order = {
            id: (0, uuid_1.v4)(),
            items,
            status: data.status,
            payedAmount: data.transaction_details.total_paid_amount,
            paymentMethod: data.payment_type_id,
            paymentId: data.id,
            feeAmount: data.fee_details[0].amount,
        };
        const result = yield (0, users_service_1.getUser)({ email });
        if (!result) {
            order.user = user;
        }
        else {
            order.userId = result.id;
        }
        (0, order_validation_1.validateOrder)(order);
        (0, order_service_1.createOrder)(order);
        return data;
    })).catch((error) => {
        // console.log(error);
        throw error;
    });
});
exports.processPayment = processPayment;
