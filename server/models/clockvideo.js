'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clockVideo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  clockVideo.init({
    videoPath: DataTypes.STRING,
    studentNumber: DataTypes.STRING,
    clock: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'clockVideo',
  });
  return clockVideo;
};