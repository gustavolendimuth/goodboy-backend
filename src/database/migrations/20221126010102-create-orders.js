/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      paymentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'payment_id',
        unique: true
      },
      payedAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        field: 'payed_amount'
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'payment_method'
      },
      feeAmount: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        field: 'fee_amount'
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        field: 'user_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false,
        field: 'updated_at'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  }
};
