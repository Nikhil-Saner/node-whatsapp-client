const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  timezone: 'Asia/Calcutta',
  dialect: 'postgres',
  dialectOptions: {
    // If you are using PostgreSQL and want to use specific options
    useUTC: false,  // Disable UTC handling to use Asia/Calcutta directly
  },
  logging: console.log, // Enable logging for debugging; set to `false` to disable
});



// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
