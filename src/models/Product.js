const { DataTypes } = require('sequelize');

const sequelize = require('../configs/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  isim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kalori: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  protein: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  karbonhidrat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  yag: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});

module.exports = Product;
