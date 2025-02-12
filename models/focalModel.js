const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const { required } = require("joi");

const focalSchema = new mongoose.Schema({
  focal_number: {type: String, required: true},
  last_name: { type: String, required: true },
  first_name: { type: String, required: true },
  middle_name: { type: String, required: true},
  email_address: { type: String, required: true},
  gender: { type: String, required: true },
  status: { type: String, required: true},
  salutation: { type: String, required: true },
  contact_number: { type: String, required: true },
  region: { type: String, required: true },
  position: { type: String, required: true },
  province: { type: String, required: true },
  focal_status: { type: String, required: true },
  role: { type: String, default: "focal" },
  password: { type: String },
  pdfFile: { type: Buffer, default: null },
}, { collection: 'Focals'});

const focalModel = mongoose.model("Focals", focalSchema);
module.exports = focalModel;