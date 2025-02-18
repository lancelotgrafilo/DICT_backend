const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  category: { type: Number, required: true },
  description: { type: String, required: true },
}, { collection: 'News-Alerts-Advertisement'});

const activityModel = new mongoose.model('Activities',activitySchema);
module.exports = activityModel;