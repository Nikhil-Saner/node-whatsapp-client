const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Replace with your Sequelize instance

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'roles',
  timestamps: false, // Disable createdAt and updatedAt fields
});

module.exports = Role;