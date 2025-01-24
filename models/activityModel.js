const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  month: { type: String, required: true },
  day: { type: Number, required: true },
  region: { type: String, required: true },
  activity: { type: String, required: true }
}, { collection: 'Activities '});

const activityModel = new mongoose.Model('Activities',activitySchema);
module.exports = activityModel;