const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const AdminModel = require("../models/adminModel");
const Joi = require('joi');
const { sendEmail } = require('./emailController');

const generateRandomPassword = (length = 6) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const adminSchema = Joi.object({
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  email_address: Joi.string().required(),
  password: Joi.string().optional(), 
});

const validateRegistration = (data) => adminSchema.validate(data);

const postAdmin = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { last_name, first_name, email_address } = req.body;

  const existingAdmin = await AdminModel.findOne({ email_address });
  if (existingAdmin) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const generatedPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(generatedPassword, 12);

  const admin = new AdminModel({ 
    last_name, 
    first_name, 
    email_address, 
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

module.exports = {
  postAdmin,
};
