/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [{
      email: 'gustavolendimuth@gmail.com',
      name: 'Gustavo Lendimuth',
      cpf: '315.982.828-08',
      role: 'admin',
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
