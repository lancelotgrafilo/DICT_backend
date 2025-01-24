const mongoose = require("mongoose");

const modulesSchema = new mongoose.Schema({
  module_name: {type: String, default: ""},
  module_description: {type: String, default: ""},
  difficulty: {type: String, default: ""},
}, { collection: 'Modules' });

const modulesModel = new mongoose.Model('Modules',modulesSchema);
module.exports = modulesModel;

