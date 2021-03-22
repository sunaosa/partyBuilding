'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  usersInformation.init({
    identity: DataTypes.STRING,
    sex: DataTypes.STRING,
    name: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    class: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usersInformation',
  });
  return usersInformation;
};