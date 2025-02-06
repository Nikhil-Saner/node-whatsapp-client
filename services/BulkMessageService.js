// services/BulkMessageService.js

const axios = require('axios');  // We're using axios for HTTP requests

require('dotenv').config();  // Load environment variables from .env file

const UtilityService = require('../services/UtilityService');

const BulkMessageRequest = require('../models/BulkMessageRequest');
const BulkMessageStatus = require('../models/BulkMessageStatus'); 

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
      static async sendBulkTextMessages(customers, message) {
        console.log("sendBulkTextMessages called..............................");
        const apiUrl = process.env.WHATSAPP_API_URL;
        const apiToken = process.env.WHATSAPP_API_TOKEN;
      
        // Initialize an array to store the results
        const results = [];
      
        for (const customer of customers) {
          // Construct the API request payload
          const body = {
            messaging_product: 'whatsapp',
            to: customer.phone,
            type: 'text',
            text: { body: message },
          };
      
          try {
            // Send the message via WhatsApp API
            const response = await axios.post(apiUrl, body, {
              headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
              },
            });
      
            // Add success result
            results.push({
              customer: customer.phone,
              status: response.status,
              data: response.data,
            });
            console.log(`Message sent to ${customer.phone}:`, response.data);
          } catch (error) {
            // Add error result
            results.push({
              customer: customer.phone,
              status: error.response?.status || 500,
              error: error.response?.data || error.message,
            });
            console.error(`Error sending message to ${customer.phone}:`, error.response?.data || error.message);
          }
        }
      
        // Return the results array
        return results;
      }
      


          /**
   * Sends bulk WhatsApp messages to a list of customers.
   * @param {Array} customers - Array of customer objects with phone and dynamic fields.
   * @param {string} templateName - The template name to use for sending messages.
   */
    static async sendBulkDynamicTextMessages(customers) {
      console.log("sendBulkDynamicTextMessages called..............................");
      const apiUrl = process.env.WHATSAPP_API_URL;
      const apiToken = process.env.WHATSAPP_API_TOKEN;
    
      // Initialize an array to store the results
      const results = [];
    
      for (const customer of customers) {
        // Construct the API request payload
        const body = {
          messaging_product: 'whatsapp',
          to: customer.phone,
          type: 'text',
          text: { body: customer.message },
        };
    
        try {
          // Send the message via WhatsApp API
          const response = await axios.post(apiUrl, body, {
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
          });
    
          // Add success result
          results.push({
            customer: customer.phone,
            status: response.status,
            data: response.data,
          });
          console.log(`Message sent to ${customer.phone}:`, response.data);
        } catch (error) {
          // Add error result
          results.push({
            customer: customer.phone,
            status: error.response?.status || 500,
            error: error.response?.data || error.message,
          });
          console.error(`Error sending message to ${customer.phone}:`, error.response?.data || error.message);
        }
      }
    
      // Return the results array
      return results;
    }
          




  //bug rectified version
  static async processBulkTemplateMessages(customers, templateName, requestId) {
    const batchSize = 100; // Process in batches of 100
    const totalCustomers = customers.length;
    let processedCustomers = 0;
    let successfulMessages = 0;
    let failedMessages = 0;
  
    try {
      // Update status to IN_PROGRESS
      await BulkMessageRequest.update({ status: 'IN_PROGRESS' }, { where: { id: requestId } });
  
      for (let i = 0; i < totalCustomers; i += batchSize) {
        const batch = customers.slice(i, i + batchSize);
  
        // Send messages for the current batch and capture the result
        const { successfulMessages: batchSuccess, failedMessages: batchFailed } = await this.sendTemplateMessagesBatch(batch, templateName, requestId);
  
        successfulMessages += batchSuccess;
        failedMessages += batchFailed;
  
        // Update processed customers count
        processedCustomers += batch.length;
  
        // Update percentage completed in the database
        const percentageCompleted = ((processedCustomers / totalCustomers) * 100).toFixed(2);
        await BulkMessageRequest.update(
          { percentageCompleted },
          { where: { id: requestId } }
        );
      }
  
      // Update status to COMPLETED after all batches are processed
      await BulkMessageRequest.update({ status: 'COMPLETED' }, { where: { id: requestId } });
  
      return { successfulMessages, failedMessages }; // Return the aggregated result
    } catch (error) {
      console.error('Error in processBulkMessages:', error.message);
  
      // Update status to FAILED in case of an error
      await BulkMessageRequest.update({ status: 'FAILED' }, { where: { id: requestId } });
  
      return { successfulMessages, failedMessages }; // Return partial results if any
    }
  }
  



// with individual status
static async sendTemplateMessagesBatch(batch, templateName, bulkRequestId) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiToken = process.env.WHATSAPP_API_TOKEN;

  let successfulMessages = 0;
  let failedMessages = 0;

  for (const customer of batch) {
    const parameters = this.createDynamicParameters(customer);

    const body = {
      messaging_product: 'whatsapp',
      to: customer.phone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [{ type: 'body', parameters }],
      },
    };

    try {
      const response = await axios.post(apiUrl, body, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Create a record for successful message
      await BulkMessageStatus.create({
        bulkMessageRequestId,  // Link to the bulk request
        customerPhone: customer.phone,
        status: 'SUCCESS',
        errorMessage: null,
      });

      successfulMessages++;
    } catch (error) {
      // Create a record for failed message
      await BulkMessageStatus.create({
        bulkMessageRequestId,  // Link to the bulk request
        customerPhone: customer.phone,
        status: 'FAILED',
        errorMessage: error.message,  // Capture the error message
      });

      console.error(`Failed to send message to ${customer.phone}:`, error.message);
      failedMessages++;
    }
  }

  // Update the bulk request with the message statistics
  const bulkRequest = await BulkMessageRequest.findByPk(bulkRequestId);
  if (bulkRequest) {
    bulkRequest.successfulMessages = successfulMessages;
    bulkRequest.failedMessages = failedMessages;
    await bulkRequest.save();
  }

  return { successfulMessages, failedMessages };
}



// WITH INDIVIDUAL STATUS AND DUMMY LOGIC
// static async sendTemplateMessagesBatch(batch, templateName, bulkRequestId) {
//   let successfulMessages = 0;
//   let failedMessages = 0;
//   console.log("bulkRequestId ============================================================ "+bulkRequestId);

//   // Simulate processing each customer
//   for (const customer of batch) {
//     const parameters = this.createDynamicParameters(customer);

//     const body = {
//       messaging_product: 'whatsapp',
//       to: customer.phone,
//       type: 'template',
//       template: {
//         name: templateName,
//         language: { code: 'en_US' },
//         components: [{ type: 'body', parameters }],
//       },
//     };

//     try {
//       // Simulate random success or failure with a delay
//       const isSuccessful = Math.random() > 0.2; // 80% chance of success
//       await new Promise(resolve => setTimeout(resolve, 100)); // Simulate a delay

//       if (isSuccessful) {
//         // Simulate a successful message
//         console.log(`Successfully sent message to ${customer.phone}`);

//         // Create a record for successful message
//         await BulkMessageStatus.create({
//           bulkMessageRequestId: bulkRequestId, // Link to the bulk request
//           customerPhone: customer.phone,
//           status: 'SUCCESS',
//           errorMessage: null,
//         });

//         successfulMessages++;
//       } else {
//         // Simulate a failed message
//         console.log(`Simulated failure for ${customer.phone}`);

//         // Create a record for failed message
//         await BulkMessageStatus.create({
//           bulkMessageRequestId: bulkRequestId, // Link to the bulk request
//           customerPhone: customer.phone,
//           status: 'FAILED',
//           errorMessage: 'Simulated failure', // Simulated error message
//         });

//         failedMessages++;
//       }
//     } catch (error) {
//       console.error(`Error while sending message to ${customer.phone}:`, error.message);

//       // Create a record for failed message
//       await BulkMessageStatus.create({
//         bulkMessageRequestId: bulkRequestId, // Link to the bulk request
//         customerPhone: customer.phone,
//         status: 'FAILED',
//         errorMessage: error.message, // Capture the error message
//       });

//       failedMessages++;
//     }
//   }

//   // Update the bulk request with the message statistics
//   const bulkRequest = await BulkMessageRequest.findByPk(bulkRequestId);
//   if (bulkRequest) {
//     bulkRequest.successfulMessages = successfulMessages;
//     bulkRequest.failedMessages = failedMessages;
//     await bulkRequest.save();
//   }

//   return { successfulMessages, failedMessages };
// }











static async processBulkMediaTemplateMessages(customers, templateName, requestId) {
  const batchSize = 100; // Process in batches of 100
  const totalCustomers = customers.length;
  let processedCustomers = 0;
  let successfulMessages = 0;
  let failedMessages = 0;

  try {
      // Update status to IN_PROGRESS
      await BulkMessageRequest.update({ status: 'IN_PROGRESS' }, { where: { id: requestId } });

      for (let i = 0; i < totalCustomers; i += batchSize) {
          const batch = customers.slice(i, i + batchSize);

          // Send messages for the current batch and capture the result
          const { successfulMessages: batchSuccess, failedMessages: batchFailed } = await this.sendMediaTemplateBatch(batch, templateName, requestId);

          successfulMessages += batchSuccess;
          failedMessages += batchFailed;

          // Update processed customers count
          processedCustomers += batch.length;

          // Update percentage completed in the database
          const percentageCompleted = ((processedCustomers / totalCustomers) * 100).toFixed(2);
          await BulkMessageRequest.update(
              { percentageCompleted },
              { where: { id: requestId } }
          );
      }

      // Update status to COMPLETED after all batches are processed
      await BulkMessageRequest.update({ status: 'COMPLETED' }, { where: { id: requestId } });

      return { successfulMessages, failedMessages }; // Return the aggregated result
  } catch (error) {
      console.error('Error in processBulkMediaTemplateMessages:', error.message);

      // Update status to FAILED in case of an error
      await BulkMessageRequest.update({ status: 'FAILED' }, { where: { id: requestId } });

      return { successfulMessages, failedMessages }; // Return partial results if any
  }
}

// static async sendMediaTemplateBatch(batch, templateName, bulkRequestId) {
//   const apiUrl = process.env.WHATSAPP_API_URL;
//   const apiToken = process.env.WHATSAPP_API_TOKEN;
//   const utilityService = new UtilityService();

//   let successfulMessages = 0;
//   let failedMessages = 0;

//   for (const customer of batch) {
//       const parameters = this.createDynamicParameters(customer);
//       const headerMediaFileLink = utilityService.generateSignedUrl(customer.headerMediaFilename);

//       const body = {
//           messaging_product: 'whatsapp',
//           to: customer.phone,
//           type: 'template',
//           template: {
//               name: templateName,
//               language: { code: 'en_US' },
//               components: [
//                   {
//                       type: 'header',
//                       parameters: [
//                           {
//                               type: 'document',
//                               document: {
//                                   link: headerMediaFileLink,
//                                   filename: customer.headerMediaFilename,
//                               },
//                           },
//                       ],
//                   },
//                   {
//                       type: 'body',
//                       parameters: parameters,
//                   },
//               ],
//           },
//       };

//       try {
//           const response = await axios.post(apiUrl, body, {
//               headers: {
//                   Authorization: `Bearer ${apiToken}`,
//                   'Content-Type': 'application/json',
//               },
//           });

//           await BulkMessageStatus.create({
//               bulkMessageRequestId: bulkRequestId,
//               customerPhone: customer.phone,
//               status: 'SUCCESS',
//               errorMessage: null,
//           });

//           successfulMessages++;
//       } catch (error) {
//           await BulkMessageStatus.create({
//               bulkMessageRequestId: bulkRequestId,
//               customerPhone: customer.phone,
//               status: 'FAILED',
//               errorMessage: error.message,
//           });

//           console.error(`Failed to send media template message to ${customer.phone}:`, error.message);
//           failedMessages++;
//       }
//   }

//   const bulkRequest = await BulkMessageRequest.findByPk(bulkRequestId);
//   if (bulkRequest) {
//       bulkRequest.successfulMessages = successfulMessages;
//       bulkRequest.failedMessages = failedMessages;
//       await bulkRequest.save();
//   }

//   return { successfulMessages, failedMessages };
// }





//DUMMY

static async sendMediaTemplateBatch(batch, templateName, bulkRequestId) {
  let successfulMessages = 0;
  let failedMessages = 0;
  console.log("bulkRequestId ============================================================ " + bulkRequestId);

  // Simulate processing each customer
  for (const customer of batch) {
    const parameters = this.createDynamicParameters(customer);
    const headerMediaFileLink = `https://dummy.url/${customer.headerMediaFilename}`; // Simulated media URL

    const body = {
      messaging_product: 'whatsapp',
      to: customer.phone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'document',
                document: {
                  link: headerMediaFileLink,
                  filename: customer.headerMediaFilename,
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: parameters,
          },
        ],
      },
    };

    try {
      // Simulate random success or failure with a delay
      const isSuccessful = Math.random() > 0.2; // 80% chance of success
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate a delay

      if (isSuccessful) {
        console.log(`Successfully sent media template message to ${customer.phone}`);

        await BulkMessageStatus.create({
          bulkMessageRequestId: bulkRequestId,
          customerPhone: customer.phone,
          status: 'SUCCESS',
          errorMessage: null,
        });

        successfulMessages++;
      } else {
        console.log(`Simulated failure for media template message to ${customer.phone}`);

        await BulkMessageStatus.create({
          bulkMessageRequestId: bulkRequestId,
          customerPhone: customer.phone,
          status: 'FAILED',
          errorMessage: 'Simulated failure',
        });

        failedMessages++;
      }
    } catch (error) {
      console.error(`Error while sending media template message to ${customer.phone}:`, error.message);

      await BulkMessageStatus.create({
        bulkMessageRequestId: bulkRequestId,
        customerPhone: customer.phone,
        status: 'FAILED',
        errorMessage: error.message,
      });

      failedMessages++;
    }
  }

  // Update the bulk request with the message statistics
  const bulkRequest = await BulkMessageRequest.findByPk(bulkRequestId);
  if (bulkRequest) {
    bulkRequest.successfulMessages = successfulMessages;
    bulkRequest.failedMessages = failedMessages;
    await bulkRequest.save();
  }

  return { successfulMessages, failedMessages };
}

    


}

module.exports = BulkMessageService;

