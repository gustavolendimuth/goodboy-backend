/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tinyClientId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'tiny_client_id'
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      complement: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      neighborhood: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'postal_code'
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'São Paulo'
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'SP'
      },
      magicLink: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'magic_link'
      },
      magicLinkExpired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'magic_link_expired'
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
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
    await queryInterface.dropTable('users');
  }
};
