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
    // Extract file name from the URL parameter
    const fileName = req.params.fileName; // E.g., dummy.pdf
    const filePath = path.join(__dirname, '../public/files', fileName); // Adjust the folder as needed

    // Set headers explicitly
    res.setHeader('Content-Type', 'application/pdf'); // Adjust MIME type dynamically if needed
    res.setHeader('Content-Disposition', 'inline'); // Serve the file directly

    // Send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Could not serve the file.');
      }
    });
  }
}

module.exports = new DownloadController();
