const mongoose = require("mongoose");

const modulesSchema = new mongoose.Schema({
  module_name: {type: String, default: ""},
  module_description: {type: String, default: ""},
  difficulty: {type: String, default: ""},
})

const modulesModel = new mongoose.Model('Module',regionSchema);
module.exports = modulesModel;
