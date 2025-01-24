// routes/TemplateRoutes.js

const express = require('express');
const authenticate = require('../middlewares/AuthMiddleware'); // Import the middleware

module.exports = function(templateController) {
  const router = express.Router();

  // Define routes and associate with controller methods
  router.get('/test', (req, res) => templateController.test(req, res));
  router.get('/fetch', authenticate, (req, res) => templateController.getTemplates(req, res));


  return router;
};
