const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const FocalModel = require("../models/focalModel");
const Joi = require('joi');
const { sendEmail } = require('./emailController');

// Function to generate a random password
const generateRandomPassword = (length = 6) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Joi schema for admin registration
const focalSchema = Joi.object({
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  email_address: Joi.string().required(),
  region: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().optional(), 
});

// Joi schema for updating admin details
const updateFocalSchema = Joi.object({
  last_name: Joi.string().optional(),
  first_name: Joi.string().optional(),
  middle_name: Joi.string().optional(),
  email_address: Joi.string().optional(),
  region: Joi.string().optional(),
});

// Joi schema for updating password
const updatePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

// Function to validate registration data
const validateRegistration = (data) => focalSchema.validate(data);

// Function to validate update admin details
const validateUpdateAdmin = (data) => updateFocalSchema.validate(data);

// Function to validate update password
const validateUpdatePassword = (data) => updatePasswordSchema.validate(data);

// POST: Create a new admin
const postFocal = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { last_name, first_name, email_address, region, role } = req.body;
  const existingAdmin = await FocalModel.findOne({ email_address });
  if (existingAdmin) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const generatedPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(generatedPassword, 12);
  const admin = new FocalModel({ 
    last_name, 
    first_name, 
    email_address,
    region, 
    role,
    password: hashedPassword, 
  });
  try {
    await admin.save();
    await sendEmail({
      email: email_address,
      plainPassword: generatedPassword,
    });
    console.log("New Admin Saved: ", admin);
    return res.status(201).json({ message: "New Admin Successfully Added" });
  } catch (err) {
    console.error('Error saving Admin:', err);
    return res.status(500).json({ message: "Failed to add Admin", error: err.message || err });
  }
});

// PATCH: Update admin details (last_name, first_name, middle_name, email_address, region)
const patchFocalDetails = asyncHandler(async (req, res) => {
  const { error } = validateUpdateAdmin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params; // Assuming you pass the admin ID in the URL
  const { last_name, first_name, middle_name, email_address, region } = req.body;

  try {
    const admin = await FocalModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields only if they are provided in the request body
    if (last_name) admin.last_name = last_name;
    if (first_name) admin.first_name = first_name;
    if (middle_name) admin.middle_name = middle_name;
    if (email_address) admin.email_address = email_address;
    if (region) admin.region = region;

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

  const { id } = req.params; // Assuming you pass the admin ID in the URL
  const { old_password, new_password } = req.body;

  try {
    const admin = await FocalModel.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(old_password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password and update it
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