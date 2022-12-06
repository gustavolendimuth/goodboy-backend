/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
        field: 'product_id'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      quantity: Sequelize.INTEGER,
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'unit_price'
      },
      description: Sequelize.STRING,
      orderId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'orders',
          key: 'id'
        },
        field: 'order_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('items');
  }
};
