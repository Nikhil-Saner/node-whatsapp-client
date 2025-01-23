// routes/WhatsAppRoutes.js

const express = require('express');
const authenticate = require('../middlewares/AuthMiddleware'); // Import the middleware
const checkRole = require('../middlewares/RoleMiddleware'); // Import the middleware

module.exports = function(authController) {
  const router = express.Router();

// Public Routes
router.get('/test', (req, res) => authController.test(req, res));
router.post('/login', (req, res) => authController.login(req, res));


// Protected Routes
router.post('/admin/register-user', authenticate, checkRole('ADMIN'), (req, res) => authController.register(req, res));
router.get('/admin/home', authenticate, checkRole('ADMIN'), (req, res) => authController.home(req, res));
router.get('/user/home', authenticate, checkRole('USER'), (req, res) => authController.home(req, res));


return router;
};