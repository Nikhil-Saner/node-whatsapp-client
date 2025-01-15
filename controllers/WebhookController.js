const axios = require('axios');
const WhatsAppMessageService = require('../services/WhatsAppMessageService');
require('dotenv').config(); // Ensure dotenv is loaded to access environment variables

class WebhookController {
  constructor(messageService) {
    this.messageService = messageService;
    this.myVerifyToken = process.env.SECRET_TOKEN; // Load the token from environment variables
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.apiToken = process.env.ACCESS_TOKEN
  }

  // Verify Webhook
  verifyWebhook(req, res) {
    console.log('Verify Webhook called...');
    const mode = req.query['hub.mode'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = req.query['hub.verify_token'];

    if (mode === 'subscribe' && verifyToken === this.myVerifyToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  }

  // Handle all webhook events
  async handleWebhook(req, res) {
    console.log('Handle Webhook called...');
    const payload = req.body;

    try {
      const entries = payload.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};

          if (value.messages) {
            // Handle incoming messages
            await this.handleIncomingMessages(value.messages);
          } else if (value.statuses) {
            // Handle message status updates
            this.handleMessageStatus(value.statuses);
          } else {
            console.log('Unhandled event type:', change);
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
    }

    res.status(200).send('EVENT_RECEIVED');
  }

  // Process incoming messages
  // async handleIncomingMessages(messages) {
  //   for (const message of messages) {
  //     const from = message.from; // Sender's phone number
  //     console.log(`Processing incoming message from ${from}`);
  //     // Send a static response
  //     await this.messageService.sendSimpleTemplateMessage(from, 'auto_reply');
  //   }
  // }

  async handleIncomingMessages(messages) {
    for (const message of messages) {
      const from = message.from; // Sender's phone number
      const messageId = message.id; // Message ID
  
      console.log(`Processing incoming message from ${from}`);
      
      // Send a static response
      await this.messageService.sendSimpleTemplateMessage(from, 'auto_reply');
  
      // Mark the message as read
      await this.messageService.markMessageAsRead(messageId)
    }
  }
  

  // Process message status updates
  handleMessageStatus(statuses) {
    statuses.forEach((status) => {
      const messageId = status.id;
      const recipientId = status.recipient_id;
      const statusType = status.status;
      const timestamp = status.timestamp;

      console.log(
        `Message ID: ${messageId}, Recipient: ${recipientId}, Status: ${statusType}, Timestamp: ${timestamp}`
      );
    });
  }
}

module.exports = WebhookController;
