const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5000', // Your frontend URL deployed on Render
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allowed methods
  credentials: true // Allow cookies or auth headers if needed
}));

connectDB();

app.use("/api", require("./routes/loginRoute"));

// app.use("/api", require("./routes/activityRoute"));
app.use("/api", require("./routes/adminRoute"));
app.use("/api", require("./routes/moduleRoute"));
app.use("/api", require("./routes/requestRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
