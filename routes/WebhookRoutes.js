// routes/WebhookRoutes.js

const express = require('express');

module.exports = function(webhookController) {
  const router = express.Router();

  // Define routes and associate with controller methods
  // router.get('/abc/test', (req, res) => webhookController.testing(req, res));
  router.get('/', (req, res) => webhookController.verifyWebhook(req, res));
  router.post('/', (req, res) => webhookController.handleWebhook(req, res));

  return router;
};

