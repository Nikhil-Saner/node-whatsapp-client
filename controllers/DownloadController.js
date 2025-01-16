const path = require('path');

class DownloadController {
  // Handle file download
  handleFileDownload(req, res) {
    const filePath = path.join(__dirname, '../public/files/dummy.pdf'); // Adjust the path to your file location
    res.download(filePath, 'dummy.pdf', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Could not download file.');
      }
    });
  }
}

module.exports = new DownloadController();
