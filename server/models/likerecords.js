'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likeRecords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  likeRecords.init({
    issurId: DataTypes.INTEGER,
    likePerson: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'likeRecords',
  });
  return likeRecords;
};