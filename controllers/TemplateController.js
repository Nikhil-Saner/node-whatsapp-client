// controllers/TemplateController.js

class TemplateController {

    // Constructor that accepts the service instance
    constructor(templateService) {
      this.templateService = templateService;
    }
  
    // Test endpoint
    test(req, res) {
      console.log("Test API called...");
      return res.status(200).send("hello");
    }
  


    // Send a simple message
    async getTemplates(req, res) {
    //   const { to, message } = req.body; // Accessing the data from request body
      console.log("getTemplates API called...");

      try {
        const response = await this.templateService.getTemplates(); // Await the Promise to resolve
        return res.status(200).json({ message: response });
      } catch (error) {
        console.error("Error in getTemplates:", error.message);
        return res.status(500).json({ error: 'Error sending message', details: error.message });
      }
    }
  }
  
  module.exports = TemplateController;
  