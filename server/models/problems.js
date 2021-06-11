'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class problems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  problems.init({
    problemTitle: DataTypes.STRING,
    problemDetails: DataTypes.STRING,
    requestor: DataTypes.STRING,
    requestNumber: DataTypes.STRING,
    state: DataTypes.STRING,
    responseMsg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'problems',
  });
  return problems;
};