const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// app.use("/api", require("./routes/activityRoute"));
app.use("/api", require("./routes/adminRoute"));
// app.use("/api", require("./routes/moduleRoute"));
// app.use("/api", require("./routes/requestRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
