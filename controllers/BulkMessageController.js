const BulkMessageService = require("../services/BulkMessageService");
const BulkMessageRequest = require('../models/BulkMessageRequest');

class BulkMessageController {


    /**
   * Handles the request to send bulk messages.
   * @param {Array} customers - Array of customer objects with dynamic parameters.
   * @param {string} templateName - The template name to be used for sending messages.
   */
    static async sendBulkTextMessages(req, res) {
      try {
        const { customers, message } = req.body;
    
        // Validate the input
        if (!customers || !Array.isArray(customers) || customers.length === 0) {
          return res.status(400).json({ message: "Invalid or missing 'customers' array." });
        }
    
        // Call the service to send messages and get the response
        const results = await BulkMessageService.sendBulkTextMessages(customers, message);
    
        // Analyze the results from the WhatsApp API
        const errors = results.filter((result) => result.status !== 200);
        if (errors.length > 0) {
          // Partial or complete failure
          return res.status(500).json({
            message: "Failed to send some or all messages.",
            errors: errors.map((err) => ({
              customer: err.customer,
              error: err.error,
            })),
          });
        }
    
        // If all messages were sent successfully
        return res.status(200).json({ message: "Messages sent successfully!" });
      } catch (error) {
        console.error("Error in BulkMessageController:", error.message);
        return res.status(500).json({ message: "Failed to send messages.", error: error.message });
      }
    }
    


      /**
   * Handles the request to send bulk messages.
   * @param {Array} customers - Array of customer objects with dynamic parameters.
   * @param {string} templateName - The template name to be used for sending messages.
   */
      static async sendBulkDynamicTextMessages(req, res) {
        try {
          const { customers } = req.body;
      
          // Validate the input
          if (!customers || !Array.isArray(customers) || customers.length === 0) {
            return res.status(400).json({ message: "Invalid or missing 'customers' array." });
          }
      
          // Call the service to send messages and get the response
          const results = await BulkMessageService.sendBulkDynamicTextMessages(customers);
      
          // Analyze the results from the WhatsApp API
          const errors = results.filter((result) => result.status !== 200);
          if (errors.length > 0) {
            // Partial or complete failure
            return res.status(500).json({
              message: "Failed to send some or all messages.",
              errors: errors.map((err) => ({
                customer: err.customer,
                error: err.error,
              })),
            });
          }
      
          // If all messages were sent successfully
          return res.status(200).json({ message: "Messages sent successfully!" });
        } catch (error) {
          console.error("Error in BulkMessageController:", error.message);
          return res.status(500).json({ message: "Failed to send messages.", error: error.message });
        }
      }
      





  // For sending template messages
  // WITH INNDIVIDUAL STATUS

  static async sendBulkTemplateMessages(req, res) {
    try {
      const { customers, templateName } = req.body;
  
      // Validate input
      if (!customers || !Array.isArray(customers) || customers.length === 0) {
        return res.status(400).json({ message: "Invalid or missing 'customers' array." });
      }
      if (!templateName) {
        return res.status(400).json({ message: 'Template name is required.' });
      }
  
      // Create a new bulk message request record
      const bulkRequest = await BulkMessageRequest.create({
        status: 'PENDING',
        totalCustomers: customers.length,
        templateName,
      });
  
      // Send an immediate response with the bulk request ID
      res.status(202).json({ message: 'Bulk message request received.', requestId: bulkRequest.id });
  
      // Process the bulk messages asynchronously
      BulkMessageService.processBulkTemplateMessages(customers, templateName, bulkRequest.id)
        .then(({ successfulMessages, failedMessages }) => {
          bulkRequest.successfulMessages = successfulMessages;
          bulkRequest.failedMessages = failedMessages;
          bulkRequest.status = 'COMPLETED';
          bulkRequest.percentageCompleted = (successfulMessages / customers.length) * 100;
          bulkRequest.save();
        })
        .catch((error) => {
          console.error('Error during bulk message processing:', error);
          bulkRequest.status = 'FAILED';
          bulkRequest.save();
        });
    } catch (error) {
      console.error('Error in sendBulkTemplateMessages controller:', error.message);
      res.status(500).json({ message: 'Failed to process bulk message request.', error: error.message });
    }
  }
  
  

  // For sending media template messages
  static async sendBulkMediaTemplateMessages(req, res) {
    console.log("Controller: sendBulkMediaTemplateMessages called-----------------------------");
    try {
        const { customers, templateName } = req.body;

        // Input Validation
        if (!customers || !Array.isArray(customers) || customers.length === 0) {
            return res.status(400).json({ message: "Invalid or missing 'customers' array." });
        }

        if (!templateName) {
            return res.status(400).json({ message: "Template name is required." });
        }

        // Create a new bulk message request record
        const bulkRequest = await BulkMessageRequest.create({
            status: "PENDING",
            totalCustomers: customers.length,
            templateName,
        });

        // Send an immediate response with the bulk request ID
        res.status(202).json({ message: "Bulk media template message request received.", requestId: bulkRequest.id });

        // Process the bulk media messages asynchronously
        BulkMessageService.processBulkMediaTemplateMessages(customers, templateName, bulkRequest.id)
            .then(({ successfulMessages, failedMessages }) => {
                bulkRequest.successfulMessages = successfulMessages;
                bulkRequest.failedMessages = failedMessages;
                bulkRequest.status = "COMPLETED";
                bulkRequest.percentageCompleted = (successfulMessages / customers.length) * 100;
                bulkRequest.save();
            })
            .catch((error) => {
                console.error("Error during bulk media template message processing:", error);
                bulkRequest.status = "FAILED";
                bulkRequest.save();
            });
    } catch (error) {
        console.error("Error in sendBulkMediaTemplateMessages controller:", error.message);
        res.status(500).json({ message: "Failed to process bulk media template message request.", error: error.message });
    }
}





  static async getBulkMessageStatus(req, res) {
    try {
      // const { requestId } = req.params;
      const { requestId } = req.query;

  
      // Fetch the complete row based on the primary key

      console.log("getBulkMessageStatus called ------------------------------------------");
      console.log("requestId ==========================================================="+requestId);
      const request = await BulkMessageRequest.findByPk(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Bulk request not found.' });
      }
  
      // Return the complete row data
      return res.status(200).json(request);
    } catch (error) {
      console.error('Error in getBulkMessageStatus:', error.message);
      res.status(500).json({ message: 'Failed to retrieve bulk message status.', error: error.message });
    }
  }


  static async getBulkMessageRequestList(req, res) {
    try {
      // Fetch all records from the BulkMessageRequest table
      const requests = await BulkMessageRequest.findAll();
      
      if (requests.length === 0) {
        return res.status(404).json({ message: 'No bulk message requests found.' });
      }
  
      // Return the list of all records
      return res.status(200).json(requests);
    } catch (error) {
      console.error('Error in getBulkMessageRequestList:', error.message);
      res.status(500).json({ message: 'Failed to retrieve all bulk message requests.', error: error.message });
    }
  }
  
  

  
  
}

module.exports = BulkMessageController;
