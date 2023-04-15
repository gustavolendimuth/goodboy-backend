/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        field: 'user_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      paymentId: {
        type: Sequelize.BIGINT,
        field: 'payment_id',
        unique: true
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'total_amount'
      },
      feeAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'fee_amount'
      },
      netReceivedAmount: {
        type: Sequelize.DECIMAL(10, 2),
        field: 'net_received_amount'
      },
      paymentMethod: {
        type: Sequelize.STRING,
        field: 'payment_method'
      }, 
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      address: Sequelize.STRING,
      number: Sequelize.STRING,
      complement: Sequelize.STRING,
      neighborhood: Sequelize.STRING,
      postalCode: {
        type: Sequelize.STRING,
        field: 'postal_code'
      },
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      tinyOrderId: {
        type: Sequelize.INTEGER,
        field: 'tiny_order_id'
      },
      invoiceId: {
        type: Sequelize.INTEGER,
        field: 'invoice_id'
      },
      invoiceStatus: {
        type: Sequelize.STRING,
        field: 'invoice_status'
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
