/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [{
      id: 'd45735b1-27a9-49d9-9fd3-476cec88bd9e',
      email: 'gustavolendimuth@gmail.com',
      name: 'Gustavo Lendimuth',
      password: '10203040'
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
