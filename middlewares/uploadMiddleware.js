const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Define the upload directory
const uploadDir = path.join(__dirname, "../uploads/cybersecurityAwarenessRequestForms");
const uploadDirFocal = path.join(__dirname, "../uploads/FocalForms");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(uploadDirFocal)) {
  fs.mkdirSync(uploadDirFocal, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files in the correct directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // Generate unique filenames
  },
});

const storageFocal = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirFocal); // Save files in the correct directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // Generate unique filenames
  },
});

// Filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const uploadFocal = multer({
  storage: storageFocal,
  fileFilter: fileFilter,
});

module.exports = { upload, uploadFocal };