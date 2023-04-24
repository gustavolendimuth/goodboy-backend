/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('orders', [{
      user_id: 1,
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
