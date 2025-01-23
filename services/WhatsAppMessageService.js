// services/WhatsAppMessageService.js

const axios = require('axios');  // We're using axios for HTTP requests

require('dotenv').config();  // Load environment variables from .env file

class WhatsAppMessageService {

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;  // Fetching from environment variables
    this.apiToken = process.env.WHATSAPP_API_TOKEN;  // API Token for authentication
  }

  // Send a simple text message
  sendTextMessage(recipient, message) {

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
    };

    const body = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: message }
    };

    return axios.post(this.apiUrl, body, { headers })
      .then(response => response.data)
      .catch(error => {
        // Improved error handling with detailed logging
        console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
        throw new Error(`Error sending message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      });
  }

  // Send a template message with dynamic variables
  sendMessageTemplateText(recipient, templateName, variables) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
    };

    // Build the template parameters
    const parameters = variables.map(variable => ({
      type: 'text',
      text: variable
    }));

    const body = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [{
          type: 'body',
          parameters: parameters
        }]
      }
    };

    return axios.post(this.apiUrl, body, { headers })
      .then(response => response.data)
      .catch(error => {
        console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
        throw new Error(`Error sending template message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
      });
  }

  // Send a simple template message without variables
  // sendSimpleTemplateMessage(recipient, templateName) {
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${this.apiToken}`,
  //   };

  //   const body = {
  //     messaging_product: 'whatsapp',
  //     to: recipient,
  //     type: 'template',
  //     template: {
  //       name: templateName,
  //       language: { code: 'en_US' }
  //     }
  //   };

  //   return axios.post(this.apiUrl, body, { headers })
  //     .then(response => response.data)
  //     .catch(error => {
  //       console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
  //       throw new Error(`Error sending simple template message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
  //     });
  // }


    // Send a admit card template message
    sendMessageTemplateMedia(recipient, templateName, variables, mediaLink, fileName) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`,
      };
  

      // Build the template parameters
      const parameters = variables.map(variable => ({
        type: 'text',
        text: variable
      }));
  
      const body = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US' },
          components: [{
            type: 'header',
            parameters: [
              {
                type: 'document',
                document: {
                  link: mediaLink,
                  filename: fileName
                }
              }
            ]
          },
          {
            type: 'body',
            parameters: parameters
          }
        ]
        }
      };
  

      return axios.post(this.apiUrl, body, { headers })
        .then(response => response.data)
        .catch(error => {
          console.error("Error details:", JSON.stringify(error.response?.data || error.message, null, 2));
          throw new Error(`Error sending template message: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
        });
    }


  async markMessageAsRead(messageId) {
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };

    const body = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    try {
      const response = await axios.post(this.apiUrl, body, { headers });
      console.log(`Message ${messageId} marked as read:`, response.data);
    } catch (error) {
      console.error(`Error marking message ${messageId} as read:`, error.response?.data || error.message);
    }
  }



}

module.exports = WhatsAppMessageService;
