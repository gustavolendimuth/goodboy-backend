/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [{
      email: 'gustavolendimuth@gmail.com',
      name: 'Gustavo Lendimuth',
      cpf: '123.456.789-81',
      role: 'admin',
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
