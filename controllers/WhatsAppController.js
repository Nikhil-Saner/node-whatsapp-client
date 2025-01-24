// controllers/WhatsAppController.js

const UtilityService = require("../services/UtilityService");

class WhatsAppController {

    // Constructor that accepts the service instance
    constructor(messageService, utilityService) {
      this.messageService = messageService;
      this.utilityService = utilityService;
    }
  
    // Test endpoint
    test(req, res) {
      console.log("Test API called...");
      return res.status(200).send("hello");
    }
  
    // Send a simple message
    // sendMessage(req, res) {
    //   const { to, message } = req.body;  // Accessing the data from request body
    //   console.log("Send Message API called...");
    //   console.log("to="+to);
    //   console.log("message="+message);

    //   try {
    //     const response = this.messageService.sendMessage(to, message);
    //     return res.status(200).json({ message: response });
    //   } catch (error) {
    //     return res.status(500).json({ error: 'Error sending message', details: error.message });
    //   }
    // }

    // Send a simple message
    async sendTextMessage(req, res) {
      const { to, message } = req.body; // Accessing the data from request body
      console.log("Send Message API called...");
  

      try {
        const response = await this.messageService.sendTextMessage(to, message); // Await the Promise to resolve
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error("Error in sendMessage:", error.message);
        return res.status(500).json({ error: 'Error sending message', details: error.message });
      }
    }

  
    // Send payment update message
    async sendMessageTemplateText(req, res) {
      const { to } = req.body;  // Accessing the recipient's number from request body
      console.log("Send Payment Update API called...");
      const variables = ["649.00", "AFCAT 01/2025"];  // Example payment update details
      try {
        const response = await this.messageService.sendMessageTemplateText(to, "payment_confirmation_2", variables);
        return res.status(200).json({ message: response });
      } catch (error) {
        return res.status(500).json({ error: 'Error sending payment update message', details: error.message });
      }
    }
  
    // Send helpdesk message
    async sendHelpdeskMessage(req, res) {
      const { to } = req.body;  // Accessing the recipient's number from request body
      console.log("Send Helpdesk Message API called...");
      try {
        const response = await this.messageService.sendSimpleTemplateMessage(to, "auto_reply");
        return res.status(200).json({ message: response });
      } catch (error) {
        return res.status(500).json({ error: 'Error sending helpdesk message', details: error.message });
      }
    }

    // Send admit card template
    async sendMessageTemplateMedia(req, res) {
      const { to } = req.body;  // Accessing the recipient's number from request body
      console.log("Send Admit Card Message API called...");
      try {
        // const admitCardLink = "https://node-whatsapp-client.onrender.com/candidate/api/download/dummy.pdf?token=secure-token-123";
        const fileName = "dummy.pdf";
        const admitCardLink = this.utilityService.generateSignedUrl(fileName);
        console.log("admitCardLink="+admitCardLink);

        const variables = [];  
        const response = await this.messageService.sendMessageTemplateMedia(to, "admit_card", variables, admitCardLink, fileName);
        return res.status(200).json({ message: response });
      } catch (error) {
        return res.status(500).json({ error: 'Error sending Admit Card message', details: error.message });
      }
    }
  }
  
  module.exports = WhatsAppController;
  