// uploadMiddleware.js
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads', 'cybersecurityAwarenessRequestForms');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Store files in the specified directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate unique filenames
  }
});

const upload = multer({ storage: storage });

module.exports = { upload };