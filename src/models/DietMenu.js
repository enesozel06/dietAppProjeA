const { DataTypes } = require('sequelize');

const sequelize = require('../configs/database');

const DietMenu = sequelize.define('DietMenu', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  products: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = DietMenu;
