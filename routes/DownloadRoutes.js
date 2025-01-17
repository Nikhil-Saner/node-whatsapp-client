const express = require('express');

module.exports = function(downloadController) {
  const router = express.Router();

  // Define routes and associate them with controller methods
//   router.get('/', (req, res) => downloadController.handleFileDownload(req, res));

    // Dynamic route to handle file names with extensions
    router.get('/:fileName', (req, res) => downloadController.handleFileDownload(req, res));

  return router;
};
