const crypto = require('crypto');
require('dotenv').config;

class UtilityService {
  constructor() {
    this.baseUrl = process.env.baseUrl;
    this.secretKeyForDownload = process.env.secretKeyForDownload; 
    this.expiresIn = 300;
  }

  /**
   * Generate a signed URL for securely accessing a file.
   * @param {string} baseUrl - The base URL of your server.
   * @param {string} fileName - The name of the file to be downloaded.
   * @param {number} expiresIn - The expiration time in seconds.
   * @returns {string} - The generated signed URL.
   */
  generateSignedUrl(fileName) {
    const expires = Math.floor(Date.now() / 1000) + this.expiresIn; // Expiration timestamp
    const signature = crypto
      .createHmac('sha256', this.secretKeyForDownload)
      .update(`${fileName}${expires}`)
      .digest('hex');
    return `${this.baseUrl}/${fileName}?token=${signature}&expires=${expires}`;
  }

  /**
   * Validate the token in the URL for secure file access.
   * @param {string} fileName - The name of the file to be accessed.
   * @param {string} token - The token from the request.
   * @param {number} expires - The expiration timestamp from the request.
   * @returns {boolean} - True if the token is valid and not expired, otherwise false.
   */
  validateSignedUrl(fileName, token, expires) {
    if (Date.now() / 1000 > parseInt(expires, 10)) {
      return false; // Link has expired
    }

    const validToken = crypto
      .createHmac('sha256', this.secretKeyForDownload)
      .update(`${fileName}${expires}`)
      .digest('hex');

    return token === validToken; // Token validation
  }
}

module.exports = UtilityService;
