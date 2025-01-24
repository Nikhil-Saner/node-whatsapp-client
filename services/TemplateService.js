const axios = require('axios');
require('dotenv').config();  // Load environment variables from .env file

class TemplateService {
 
  constructor() {
    this.templateApiUrl = 'https://graph.facebook.com/v21.0/101945512825440/message_templates';  // Fetching from environment variables
    this.apiToken = process.env.WHATSAPP_API_TOKEN;  // API Token for authentication
  }
  async getTemplates() {
    try {
      // Make the API call
      const response = await axios.get(this.templateApiUrl, {
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      });

      // Return the templates data
      return response.data; // Contains the WhatsApp templates JSON response
    } catch (error) {
      console.error('Error communicating with WhatsApp API:', error.message);
      throw new Error('Failed to fetch templates from WhatsApp API.');
    }
  }
}

module.exports = TemplateService;
