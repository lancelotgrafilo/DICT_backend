const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: Number, required: true },
}, { collection: 'News-Alerts-Advertisement'});

const activityModel = new mongoose.Model('Activities',activitySchema);
module.exports = activityModel;