// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const path = require('path');

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL deployed on Render
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow cookies or auth headers if needed
}));

connectDB();

app.use("/api", require("./routes/loginRoute"));
// app.use("/api", require("./routes/activityRoute"));
app.use("/api", require("./routes/adminRoute"));
app.use("/api", require("./routes/moduleRoute"));
app.use("/api", require("./routes/requestRoute"));
app.use('/api', require('./routes/historyRoute'));
app.use('/api', require("./routes/fileRoute"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
