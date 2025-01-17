const path = require('path');

class DownloadController {
  // Handle file download
//   handleFileDownload(req, res) {
//     const filePath = path.join(__dirname, '../public/files/dummy.pdf'); // Adjust the path to your file location
//     res.download(filePath, 'dummy.pdf', (err) => {
//       if (err) {
//         console.error('Error sending file:', err);
//         res.status(500).send('Could not download file.');
//       }
//     });
//   }


     // Handle file download
  handleFileDownload(req, res) {
    const filePath = path.join(__dirname, '../public/files/dummy.pdf'); // Adjust the path to your file location

    // Set headers explicitly to meet WhatsApp requirements
    res.setHeader('Content-Type', 'application/pdf'); // Ensure correct MIME type
    res.setHeader('Content-Disposition', 'inline'); // Serve the file directly without forcing download

    // Send the file as-is
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Could not serve the file.');
      }
    });
  }
}

module.exports = new DownloadController();
