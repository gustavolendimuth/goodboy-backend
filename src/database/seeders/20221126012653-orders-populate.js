/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('orders', [{
      id: 'f48d8529-5c25-4977-a8d7-0c8294779c83',
      user_id: 'd45735b1-27a9-49d9-9fd3-476cec88bd9e',
      payment_id: 1311096369,
      status: 'approved',
      total_amount: 39.90,
      fee_amount: 2,
      net_received_amount: 37.90,
      payment_method: 'credit_card',
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
