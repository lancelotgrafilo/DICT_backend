const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  module_name: {type: String, default: ""},

})

const moduleModel = new mongoose.Model('Module',regionSchema);
module.exports = moduleModel;
