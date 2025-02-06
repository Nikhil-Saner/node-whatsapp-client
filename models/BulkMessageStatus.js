// models/bulkMessageStatus.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BulkMessageRequest = require('./BulkMessageRequest');  // Assuming you have a BulkMessageRequest model

const BulkMessageStatus = sequelize.define('BulkMessageStatus', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bulkMessageRequestId: {
    type: DataTypes.UUID,
    references: {
      model: BulkMessageRequest,
      key: 'id',
    },
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('SUCCESS', 'FAILED'),
    allowNull: false,
  },
  errorMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
    timestamps: true, // Automatically add createdAt and updatedAt
    createdAt: 'createdAt', // You can also specify custom column names if needed
    updatedAt: 'updatedAt',
});

BulkMessageRequest.hasMany(BulkMessageStatus, { foreignKey: 'bulkMessageRequestId' });
BulkMessageStatus.belongsTo(BulkMessageRequest, { foreignKey: 'bulkMessageRequestId' });

module.exports = BulkMessageStatus;
