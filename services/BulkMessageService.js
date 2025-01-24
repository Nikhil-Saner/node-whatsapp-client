// services/BulkMessageService.js

const axios = require('axios');  // We're using axios for HTTP requests

require('dotenv').config();  // Load environment variables from .env file

const UtilityService = require('../services/UtilityService');

class BulkMessageService {
  /**
   * Dynamically constructs the 'parameters' array for each customer.
   * @param {Object} customer - The customer object containing phone and other dynamic fields.
   * @returns {Array} - Array of parameter objects for the WhatsApp API.
   */
  static createDynamicParameters(customer) {
    const parameters = [];

    // Add the phone number as the first parameter (mandatory)
    // parameters.push({ type: "text", text: customer.phone });

    // Dynamically add all other properties (excluding 'phone')
    Object.keys(customer).forEach((key) => {
      if (key !== "phone" && key !== 'headerMediaFilename') {
        parameters.push({ type: "text", text: customer[key] });
      }
    });

    return parameters;
  }

  /**
   * Sends bulk WhatsApp messages to a list of customers.
   * @param {Array} customers - Array of customer objects with phone and dynamic fields.
   * @param {string} templateName - The template name to use for sending messages.
   */
  static async sendBulkMessages(customers, templateName) {
    const apiUrl = process.env.WHATSAPP_API_URL;
    const apiToken = process.env.WHATSAPP_API_TOKEN;

    for (const customer of customers) {
      // Dynamically generate the 'parameters' array for the customer
      const parameters = this.createDynamicParameters(customer);


      console.log(JSON.stringify(parameters));
      // Construct the API request payload
      const body = {
        messaging_product: "whatsapp",
        to: customer.phone, // The recipient's phone number
        type: "template",
        template: {
          name: templateName, // The template name
          language: { code: "en_US" }, // Language of the template
          components: [
            {
              type: "body",
              parameters, // Dynamically generated parameters
            },
          ],
        },
      };

      try {
        // Send the message via WhatsApp API
        const response = await axios.post(apiUrl, body, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        });
        console.log(`Message sent to ${customer.phone}:`, response.data);
      } catch (error) {
        console.error(`Error sending message to ${customer.phone}:`, error.response?.data || error.message);
      }
    }
  }

    /**
   * Sends bulk WhatsApp messages to a list of customers.
   * @param {Array} customers - Array of customer objects with phone and dynamic fields.
   * @param {string} templateName - The template name to use for sending messages.
   */
    static async sendBulkMediaTemplateMessages(customers, templateName) {
      const apiUrl = process.env.WHATSAPP_API_URL;
      const apiToken = process.env.WHATSAPP_API_TOKEN;
  
      for (const customer of customers) {
        // Dynamically generate the 'parameters' array for the customer
        const parameters = this.createDynamicParameters(customer);

        const utilityService = new UtilityService();
        const headerMediaFileLink = utilityService.generateSignedUrl(customer.headerMediaFilename)
  
        console.log(JSON.stringify(parameters));
        // Construct the API request payload
        const body = {
          messaging_product: 'whatsapp',
          to: customer.phone,
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
                    link: headerMediaFileLink,
                    filename: customer.headerMediaFilename
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
  
        try {
          // Send the message via WhatsApp API
          const response = await axios.post(apiUrl, body, {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
          });
          console.log(`Message sent to ${customer.phone}:`, response.data);
        } catch (error) {
          console.error(`Error sending message to ${customer.phone}:`, error.response?.data || error.message);
        }
      }
    }


}

module.exports = BulkMessageService;

