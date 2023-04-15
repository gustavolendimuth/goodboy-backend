/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('items', [{
      product_id: 'c37c2cc1-3d35-4d82-91ec-d7f49b8cddf7',
      title: 'Alimento Nutrópica Porquinho da Índia',
      quantity: 1,
      unit_price: 39.90,
      order_id: 1,
      ncm: '2309.10.00',
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('items', null, {});
  }
};
