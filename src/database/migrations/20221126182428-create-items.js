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
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        field: 'unit_price'
      },
      orderId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id'
        },
        field: 'order_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      image: Sequelize.STRING,
      ncm: {
        type: Sequelize.STRING,
        allowNull: false
      },
      originCode: {
        type: Sequelize.STRING,
        field: 'origin_code',
      },
      slug: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('items');
  }
};
