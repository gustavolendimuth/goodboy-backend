"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = __importDefault(require("./"));
class UserModel extends sequelize_1.Model {
}
UserModel.init({
    id: {
        type: sequelize_1.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.STRING,
        allowNull: false,
    },
    email: sequelize_1.STRING,
    magicLink: {
        type: sequelize_1.UUIDV4,
        allowNull: true,
    },
    magicLinkExpired: {
        type: sequelize_1.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    role: {
        type: sequelize_1.STRING,
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    underscored: true,
    modelName: 'users',
    sequelize: _1.default,
    timestamps: true,
    freezeTableName: true
});
exports.default = UserModel;
