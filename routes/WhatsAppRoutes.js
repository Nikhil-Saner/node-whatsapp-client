// routes/WhatsAppRoutes.js

const express = require('express');

module.exports = function(whatsappController) {
  const router = express.Router();

  // Define routes and associate with controller methods
  router.get('/test', (req, res) => whatsappController.test(req, res));
  router.post('/send', (req, res) => whatsappController.sendMessage(req, res));
  router.post('/sendPaymentUpdate', (req, res) => whatsappController.sendPaymentUpdateMessage(req, res));
  router.post('/sendHelpdeskMessage', (req, res) => whatsappController.sendHelpdeskMessage(req, res));

  return router;
};
