// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Required for CORS
const connectDB = require('./config/db');
const dotenv = require('dotenv').config(); // Environment variables

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend communication
app.use(cors({
  origin: 'https://egrade-frontend.onrender.com', // Your frontend URL deployed on Render
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow cookies or auth headers if needed
}));

// MongoDB Connection
connectDB(); // Call to connect to MongoDB

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
