// routes/WhatsAppRoutes.js

const express = require('express');
const authenticate = require('../middlewares/AuthMiddleware'); // Import the middleware
const BulkMessageController = require('../controllers/BulkMessageController');

module.exports = function(whatsappController) {
  const router = express.Router();

  // Define routes and associate with controller methods
  router.get('/test', (req, res) => whatsappController.test(req, res));
  router.post('/sendTextMessage', authenticate, (req, res) => whatsappController.sendTextMessage(req, res));
  router.post('/sendMessageTemplateText', authenticate, (req, res) => whatsappController.sendMessageTemplateText(req, res));
  router.post('/sendHelpdeskMessage', authenticate, (req, res) => whatsappController.sendHelpdeskMessage(req, res));
  router.post('/sendMessageTemplateMedia', authenticate, (req, res) => whatsappController.sendMessageTemplateMedia(req, res));
  router.post('/sendBulkMessages', authenticate, (req, res) => BulkMessageController.sendBulkMessages(req,res));

  return router;
};
