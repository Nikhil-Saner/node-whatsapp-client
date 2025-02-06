// models/bulkMessageRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ensure this is the correct path to your db.js file

const BulkMessageRequest = sequelize.define('BulkMessageRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'),
    defaultValue: 'PENDING',
  },
  percentageCompleted: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0, // Starts at 0%
  },
  totalCustomers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  templateName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  successfulMessages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  failedMessages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
  createdAt: 'createdAt', // You can also specify custom column names if needed
  updatedAt: 'updatedAt',
});

module.exports = BulkMessageRequest;
