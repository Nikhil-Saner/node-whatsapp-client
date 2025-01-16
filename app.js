// app.js

const express = require('express');
const bodyParser = require('body-parser');
const WhatsAppController = require('./controllers/WhatsAppController');
const WhatsAppMessageService = require('./services/WhatsAppMessageService');
const WhatsAppRoutes = require('./routes/WhatsAppRoutes');
const WebhookRoutes = require('./routes/WebhookRoutes');
const WebhookController = require('./controllers/WebhookController');

const DownloadRoutes = require('./routes/DownloadRoutes');
const DownloadController = require('./controllers/DownloadController');

const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


// Create instances of services
const messageService = new WhatsAppMessageService();

// Create an instance of the controller, passing the messageService instance
const whatsappController = new WhatsAppController(messageService);
const webhookController = new WebhookController(messageService);
// const downloadContoller = new DownloadController();

// Middleware for JSON and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up routes, passing the controller methods
app.use('/candidate/api/whatsapp', WhatsAppRoutes(whatsappController));
app.use('/candidate/api/webhook', WebhookRoutes(webhookController));
app.use('/candidate/api/download', DownloadRoutes(DownloadController));


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
