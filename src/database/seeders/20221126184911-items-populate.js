/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('items', [{
      product_id: 'c37c2cc1-3d35-4d82-91ec-d7f49b8cddf7',
      title: 'Prancha de surf',
      quantity: 1,
      unit_price: 1200.50,
      order_id: 'f48d8529-5c25-4977-a8d7-0c8294779c83',
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
