const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const AdminModel = require('../models/adminModel');

const postLogin = asyncHandler(async (req, res) => {
  const { email_address, password } = req.body;

  let user;
  let role = '';
  const models = {
    admin: AdminModel,
  };

  for (const [key, model] of Object.entries(models)) {
    user = await model.findOne({ email_address });
    if (user) {
      role = key; // Identify the model in which the user was found
      console.log(`User found in ${key} model:`, user);
      break;
    }
  }

  if (!user) {
    console.error("No user found with the provided email:", { email_address });
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    console.error(`Password mismatch for user: ${email_address}`);
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    if (!isMatch) {
      console.error("Password mismatch for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update isActive to true
    await user.updateOne({ isActive: true });

    // Prepare the ID response based on user type
    let responseID = '';

    if (role === 'admin') {
      responseID = user.ID;
    } 
    // Include the responseID in the JWT payload
    const tokenPayload = {
      id: user._id,
      role,
      userId: responseID // Include the ID as a string in the JWT payload
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      role,
      userId: responseID, // Send the ID directly in the response
    });

  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "An error occurred during login" });
  }
});


module.exports = {
  postLogin,
};
