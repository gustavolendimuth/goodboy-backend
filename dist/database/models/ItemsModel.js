"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = __importDefault(require("."));
class ItemsModel extends sequelize_1.Model {
}
ItemsModel.init({
    id: {
        type: sequelize_1.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: sequelize_1.UUID,
        allowNull: false
    },
    title: sequelize_1.STRING,
    quantity: sequelize_1.INTEGER,
    unitPrice: sequelize_1.DECIMAL,
    description: sequelize_1.STRING,
    orderId: {
        type: sequelize_1.UUID
    }
}, {
    underscored: true,
    modelName: 'items',
    sequelize: _1.default,
    timestamps: false,
    freezeTableName: true
});
exports.default = ItemsModel;
