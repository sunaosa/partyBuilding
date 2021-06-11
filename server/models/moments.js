'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class moments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  moments.init({
    issuername: DataTypes.STRING,
    identity: DataTypes.STRING,
    content: DataTypes.TEXT,
    imagePaths: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'moments',
  });
  return moments;
};