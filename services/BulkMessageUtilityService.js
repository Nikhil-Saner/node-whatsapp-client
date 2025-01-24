const crypto = require('crypto');
require('dotenv').config;

class BulkMessageUtilityService {
//   constructor() {

//   }


  // Function to dynamically construct the 'parameters' array
    createDynamicParameters(customer) {
        const parameters = [];
        
        // Add the phone number as the first parameter (mandatory)
        // parameters.push({ type: "text", text: customer.phone });
    
        // Dynamically add all other properties (excluding 'phone')
        Object.keys(customer).forEach((key) => {
        if (key !== "phone") {
            parameters.push({ type: "text", text: customer[key] });
        }
        });
    
        return parameters;
    }




}

module.exports = BulkMessageUtilityService;
