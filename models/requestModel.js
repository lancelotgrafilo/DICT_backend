const mongoose = require('mongoose');

const modulesSchema = new mongoose.Schema({
  module_name: {type: String, default: ""},
  module_description: {type: String, default: ""},
  difficulty: {type: String, default: ""}
});

const requestSchema = new mongoose.Schema({
  salutation: { type: String, required: true },
  last_name: { type: String, required: true },
  first_name: { type: String, required: true},
  middle_name: { type: String, required: true},
  extension_name: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  email_address: { type: String, required: true },
  contact_number: { type: String, required: true },
  organization_name: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  total_hours: { type: Number, required: true },
  classification: { type: String, required: true },
  modules_selected: { type: [modulesSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'Requests'});

const requestModel = new mongoose.Model('Requests',requestSchema);
module.exports = requestModel;
