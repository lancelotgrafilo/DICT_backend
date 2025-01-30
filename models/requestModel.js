const { date, required } = require('joi');
const mongoose = require('mongoose');

const modulesSchema = new mongoose.Schema({
  module_name: { type: String, default: "" },
  module_description: { type: String, default: "" },
  difficulty: { type: String, default: "" }
});

const preferred_date_and_time = new mongoose.Schema({
  date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  total_hours: { type: Number, required: true }
});

const requestSchema = new mongoose.Schema({
  salutation: { type: String, required: true },
  last_name: { type: String, required: true },
  first_name: { type: String, required: true },
  middle_name: { type: String, required: true },
  extension_name: { type: String, required: false, default: '' },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  email_address: { type: String, required: true },
  contact_number: { type: String, required: true },
  organization_name: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  date_and_time: { type: [preferred_date_and_time], required: true },
  modules_selected: { type: [modulesSchema], default: [] },
  createdAt: { type: Date, default: Date.now }, // Timestamp when request is created
  status: { type: String, default: "pending" }, // Default status
  statusUpdatedAt: { type: Date, default: null } // Timestamp when status is updated
}, { collection: 'Requests' });

const requestModel = mongoose.model('Requests', requestSchema);
module.exports = requestModel;
