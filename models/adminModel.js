const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  last_name: { type: String, required: true },
  first_name: { type: String, required: true },
  middle_name: { type: String, required: true},
  email_address: { type: String, required: true},
  region: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String },
}, { collection: 'Admins'});

const adminModel = mongoose.model("Admins", adminSchema);
module.exports = adminModel;