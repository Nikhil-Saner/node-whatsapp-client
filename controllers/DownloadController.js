const path = require('path');
class DownloadController {

    // Constructor that accepts the service instance
    constructor(utilityService) {
      this.utilityService = utilityService;
    }

  // Handle file download
//   handleFileDownload(req, res) {
//     // Extract file name from the URL parameter
//     const fileName = req.params.fileName; // E.g., dummy.pdf
//     const filePath = path.join(__dirname, '../public/files', fileName); // Adjust the folder as needed

//     // Set headers explicitly
//     res.setHeader('Content-Type', 'application/pdf'); // Adjust MIME type dynamically if needed
//     res.setHeader('Content-Disposition', 'inline'); // Serve the file directly

//     // Send the file
//     res.sendFile(filePath, (err) => {
//       if (err) {
//         console.error('Error sending file:', err);
//         res.status(500).send('Could not serve the file.');
//       }
//     });
//   }


  // Handle file download with token validation
  handleFileDownload(req, res) {
    // const fileName = req.params.fileName; // File name from URL
    // const filePath = path.join(__dirname, '../public/files', fileName); // File location
    // const token = req.query.token; // Security token passed as query param

    // // Validate the token
    // const validToken = 'secure-token-123'; // Replace with your own token logic
    // if (!token || token !== validToken) {
    //   return res.status(403).json({ error: 'Unauthorized access. Invalid or missing token.' });
    // }


    const { fileName } = req.params;
    const { token, expires } = req.query;
    const filePath = path.join(__dirname, '../public/files', fileName);


    // Validate the token
    if (!this.utilityService.validateSignedUrl(fileName, token, expires)) {
      return res.status(403).send('Invalid or expired token');
    }

    // Set headers explicitly
    res.setHeader('Content-Type', 'application/pdf'); // Adjust dynamically based on file type
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

module.exports = DownloadController;
