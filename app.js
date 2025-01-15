// app.js

const express = require('express');
const bodyParser = require('body-parser');
const WhatsAppController = require('./controllers/WhatsAppController');
const WhatsAppMessageService = require('./services/WhatsAppMessageService');
const WhatsAppRoutes = require('./routes/WhatsAppRoutes');
const WebhookRoutes = require('./routes/WebhookRoutes');
const WebhookController = require('./controllers/WebhookController');

const app = express();
const port = process.env.PORT || 3000;


// Create instances of services
const messageService = new WhatsAppMessageService();

// Create an instance of the controller, passing the messageService instance
const whatsappController = new WhatsAppController(messageService);
const webhookController = new WebhookController(messageService);

// Middleware for JSON and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes, passing the controller methods
app.use('/candidate/api/whatsapp', WhatsAppRoutes(whatsappController));
app.use('/candidate/api/webhook', WebhookRoutes(webhookController));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
