'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videoInfor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  videoInfor.init({
    videoPath: DataTypes.STRING,
    theme: DataTypes.STRING,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'videoInfor',
  });
  return videoInfor;
};