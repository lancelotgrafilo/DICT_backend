const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const FocalModel = require('../models/focalModel');
const Joi = require('joi');
const { sendEmail } = require('./emailController');
const fs = require('fs');
const path = require('path');

// Helper: Generate a random password
const generateRandomPassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
};

// Joi Schemas
const focalSchema = Joi.object({
  focal_number: Joi.string().required(),
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  middle_name: Joi.string().required(),
  email_address: Joi.string().email().required(),
  gender: Joi.string().required(),
  status: Joi.string().required(),
  salutation: Joi.string().required(),
  contact_number: Joi.string().required(),
  region: Joi.string().required(),
  position: Joi.string().required(),
  province: Joi.string().required(),
  focal_status: Joi.string().valid('PRIMARY', 'SECONDARY', 'THIRD').required(),
  role: Joi.string(),
  password: Joi.string().optional(),
  pdfFile: Joi.string().required(),
});

const updateFocalSchema = Joi.object({
  last_name: Joi.string().optional(),
  first_name: Joi.string().optional(),
  middle_name: Joi.string().optional(),
  email_address: Joi.string().email().optional(),
  region: Joi.string().optional(),
});

const updatePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(8).required(),
});

// Validation Functions
const validate = (schema) => (data) => schema.validate(data);

const validateRegistration = validate(focalSchema);
const validateUpdateAdmin = validate(updateFocalSchema);
const validateUpdatePassword = validate(updatePasswordSchema);

// POST: Create a new admin
const postFocal = asyncHandler(async (req, res) => {
  console.log("Request received:", req.body);
  console.log("Uploaded File:", req.file);

  // Ensure a PDF file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: "PDF file is required" });
  }

  // Combine req.body and req.file into a single parsedBody object
  const parsedBody = {
    ...req.body,
    pdfFile: req.file ? req.file.path : "", // Set pdfFile to the file path or empty string
  };
  console.log("Parsed Body:", parsedBody);

  // Validate the request body
  const { error } = validateRegistration(parsedBody);
  if (error) {
    console.error("Validation Error Details:", error.details);
    return res.status(400).json({ message: error.details[0].message });
  }

  // Read the file into a Buffer
  const pdfFilePath = req.file.path;
  let pdfBuffer;
  try {
    const pdfData = fs.readFileSync(pdfFilePath); // Read the file into memory
    pdfBuffer = Buffer.from(pdfData); // Convert to Buffer
    console.log("PDF Buffer Length:", pdfBuffer.length);
  } catch (err) {
    console.error("Error reading PDF file:", err);
    return res.status(500).json({ message: "Failed to process PDF file", error: err.message });
  }

  // Destructure fields from parsedBody
  const {
    focal_number,
    last_name,
    first_name,
    middle_name,
    email_address,
    gender,
    status,
    salutation,
    contact_number,
    region,
    position,
    province,
    focal_status,
  } = parsedBody;

  // Check if email is already registered
  const existingAdmin = await FocalModel.findOne({ email_address });
  if (existingAdmin) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Generate a random password and hash it
  const generatedPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(generatedPassword, 12);

  // Create a new admin record
  const admin = new FocalModel({
    focal_number,
    last_name,
    first_name,
    middle_name,
    email_address,
    gender,
    status,
    salutation,
    contact_number,
    region,
    position,
    province,
    focal_status,
    password: hashedPassword,
    pdfFile: pdfBuffer, // Save the file as a Buffer
  });

  try {
    await admin.save();
    await sendEmail({ email: email_address, plainPassword: generatedPassword });
    console.log("New Admin Saved:", admin);
    return res.status(201).json({ message: "New Admin Successfully Added" });
  } catch (err) {
    console.error('Error saving Admin:', err);
    return res.status(500).json({ message: "Failed to add Admin", error: err.message || err });
  }
});

// PATCH: Update admin details
const patchFocalDetails = asyncHandler(async (req, res) => {
  const { error } = validateUpdateAdmin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;
  const updates = req.body;

  try {
    const admin = await FocalModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update only the fields provided in the request body
    Object.keys(updates).forEach((key) => {
      admin[key] = updates[key];
    });

    await admin.save();
    return res.status(200).json({ message: "Admin details updated successfully", admin });
  } catch (err) {
    console.error('Error updating admin details:', err);
    return res.status(500).json({ message: "Failed to update admin details", error: err.message || err });
  }
});

// PATCH: Update admin password
const patchFocalPassword = asyncHandler(async (req, res) => {
  const { error } = validateUpdatePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;
  const { old_password, new_password } = req.body;

  try {
    const admin = await FocalModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(old_password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 12);
    admin.password = hashedNewPassword;
    await admin.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error('Error updating admin password:', err);
    return res.status(500).json({ message: "Failed to update password", error: err.message || err });
  }
});

module.exports = {
  postFocal,
  patchFocalDetails,
  patchFocalPassword,
};