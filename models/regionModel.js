const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  region: {type: String, default: ""},

})

const regionModel = new mongoose.Model('Region',regionSchema);
module.exports = regionModel;
