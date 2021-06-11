'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class activityClock extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    activityClock.init({
        activityId: DataTypes.INTEGER,
        studentNumber: DataTypes.STRING,
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'activityClock',
    });
    return activityClock;
};