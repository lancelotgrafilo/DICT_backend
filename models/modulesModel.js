const mongoose = require("mongoose");

const modulesSchema = new mongoose.Schema({
  module_name: {type: String, default: ""},
  duration: {type: String, default: ""},
  module_description: {type: String, default: ""},
  difficulty: {type: String, default: ""}
}, { collection: 'Modules' });

const modulesModel = new mongoose.model('Modules', modulesSchema);
module.exports = modulesModel;

