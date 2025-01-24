// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const AuthController = require('./controllers/AuthController');
const WhatsAppController = require('./controllers/WhatsAppController');
const WebhookController = require('./controllers/WebhookController');
const MediaController = require('./controllers/MediaController');
const TemplateController = require('./controllers/TemplateController');
const WhatsAppMessageService = require('./services/WhatsAppMessageService');
const UtilityService = require('./services/UtilityService');
const TemplateService = require('./services/TemplateService');
const AuthRoutes = require('./routes/AuthRoutes');
const WhatsAppRoutes = require('./routes/WhatsAppRoutes');
const WebhookRoutes = require('./routes/WebhookRoutes');
const MediaRoutes = require('./routes/MediaRoutes');
const TemplateRoutes = require('./routes/TemplateRoutes');




const app = express();
const port = process.env.PORT || 3000;


// Create instances of services
const messageService = new WhatsAppMessageService();
const utilityService = new UtilityService();
const templateService = new TemplateService();

// Create an instance of the controller, passing the messageService instance
const whatsappController = new WhatsAppController(messageService,utilityService);
const webhookController = new WebhookController(messageService);
const mediaContoller = new MediaController(utilityService);
const authController = new AuthController();
const templateController = new TemplateController(templateService);

// Middleware for JSON and URL encoded data
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up routes, passing the controller methods
app.use('/whatsapp', WhatsAppRoutes(whatsappController));
app.use('/webhook', WebhookRoutes(webhookController));
app.use('/media', MediaRoutes(mediaContoller));
app.use('/auth', AuthRoutes(authController));
app.use('/template', TemplateRoutes(templateController));


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});