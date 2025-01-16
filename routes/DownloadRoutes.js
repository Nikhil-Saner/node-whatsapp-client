const express = require('express');

module.exports = function(downloadController) {
  const router = express.Router();

  // Define routes and associate them with controller methods
  router.get('/dummy', (req, res) => downloadController.handleFileDownload(req, res));

  return router;
};
