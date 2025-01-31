const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  transaction: { 
    type: String, 
    default: "" 
  },
}, { collection: 'History' });

const historyModel = mongoose.model('History', historySchema);

module.exports = historyModel;
