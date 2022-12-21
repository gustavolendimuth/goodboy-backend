"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const _1 = __importDefault(require("."));
const ItemsModel_1 = __importDefault(require("./ItemsModel"));
const UserModel_1 = __importDefault(require("./UserModel"));
class OrderModel extends sequelize_2.Model {
}
OrderModel.init({
    id: {
        type: sequelize_2.UUID,
        primaryKey: true,
        allowNull: false,
    },
    paymentId: {
        type: sequelize_2.INTEGER,
        allowNull: false,
        unique: true
    },
    payedAmount: {
        type: sequelize_1.DECIMAL,
        allowNull: false,
    },
    feeAmount: {
        type: sequelize_1.DECIMAL,
        allowNull: false,
    },
    paymentMethod: {
        type: sequelize_2.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_2.STRING,
        allowNull: false,
        defaultValue: 'pending',
    }
}, {
    underscored: true,
    modelName: 'orders',
    sequelize: _1.default,
    timestamps: true,
    freezeTableName: true
});
UserModel_1.default.hasMany(OrderModel);
OrderModel.belongsTo(UserModel_1.default, { foreignKey: 'userId' });
OrderModel.hasMany(ItemsModel_1.default);
ItemsModel_1.default.belongsTo(OrderModel, { foreignKey: 'orderId' });
exports.default = OrderModel;
