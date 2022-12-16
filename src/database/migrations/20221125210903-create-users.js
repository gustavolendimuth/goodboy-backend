/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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
