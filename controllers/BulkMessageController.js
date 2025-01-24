const BulkMessageService = require("../services/BulkMessageService");

class BulkMessageController {
  /**
   * Handles the request to send bulk messages.
   * @param {Array} customers - Array of customer objects with dynamic parameters.
   * @param {string} templateName - The template name to be used for sending messages.
   */
  static async sendBulkMessages(req, res) {
    try {
      const { customers, templateName } = req.body;

      if (!customers || !Array.isArray(customers) || customers.length === 0) {
        return res.status(400).json({ message: "Invalid or missing 'customers' array." });
      }

      if (!templateName) {
        return res.status(400).json({ message: "Template name is required." });
      }

      // Call the service to send messages
      await BulkMessageService.sendBulkMessages(customers, templateName);

      return res.status(200).json({ message: "Messages sent successfully!" });
    } catch (error) {
      console.error("Error in BulkMessageController:", error.message);
      return res.status(500).json({ message: "Failed to send messages.", error: error.message });
    }
  }
}

module.exports = BulkMessageController;
