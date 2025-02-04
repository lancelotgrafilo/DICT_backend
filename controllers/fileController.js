// controllers/fileController.js
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

// Utility function to get file names from a directory
const getFilesFromDirectory = (dirPath) => {
  return fs.readdirSync(dirPath).map(file => ({
    name: file,
    url: `/uploads/${path.basename(dirPath)}/${file}`
  }));
};

const getFiles = asyncHandler(async (req, res) => {
  const cybersecurityAwarenessRequestFormsDir = path.join(__dirname, '../uploads/cybersecurityAwarenessRequestForms');
  try {
    const cybersecurityForms = getFilesFromDirectory(cybersecurityAwarenessRequestFormsDir);
    res.json({
      cybersecurityForms // Ensure this matches the frontend expectation
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = {
  getFiles
}
