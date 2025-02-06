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
  router.post('/sendBulkTemplateMessages', authenticate, (req, res) => BulkMessageController.sendBulkTemplateMessages(req,res));
  router.post('/sendBulkMediaTemplateMessages', authenticate, (req, res) => BulkMessageController.sendBulkMediaTemplateMessages(req,res));
  router.post('/sendBulkTextMessages', authenticate, (req, res) => BulkMessageController.sendBulkTextMessages(req,res));
  router.post('/sendBulkDynamicTextMessages', authenticate, (req, res) => BulkMessageController.sendBulkDynamicTextMessages(req,res));
  router.get('/getBulkMessageStatus', authenticate, (req, res) => BulkMessageController.getBulkMessageStatus(req,res));
  router.get('/getBulkMessageRequestList', authenticate, (req, res) => BulkMessageController.getBulkMessageRequestList(req,res));


  return router;
};
