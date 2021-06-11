'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('problems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      problemTitle: {
        type: Sequelize.STRING
      },
      problemDetails: {
        type: Sequelize.STRING
      },
      requestor: {
        type: Sequelize.STRING
      },
      requestNumber: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      responseMsg: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('problems');
  }
};