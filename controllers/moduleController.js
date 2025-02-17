const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const ModuleModel = require('../models/modulesModel');

const moduleSchema = Joi.object({
  module_name: Joi.string().required(),
  duration: Joi.string().required(),
  module_description: Joi.string().required(),
  difficulty: Joi.string(),
});

const validateRegistration = (data) => moduleSchema.validate(data);

const postModule = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { module_name, duration, module_description, difficulty } = req.body;

  const module = new ModuleModel({
    module_name,
    duration,
    module_description,
    difficulty
  })

  try{
    await module.save();
    
    console.log("New Module Added: ", module);
    return res.status(201).json({ message: "New Module Successfully Added"});
  }catch (err) {
    console.error('Error saving Module: ', err);
    return res.status(500).json({ message: "Failed to add Module", error: err.message || err });
  }
});

const getModules = asyncHandler(async (req, res) => {
  try {
    const modules = await ModuleModel.find();  // Fetch all modules from the database
    if (modules.length === 0) {
      return res.status(404).json({ message: "No modules found" });
    }
    return res.status(200).json(modules);  // Return the list of modules
  } catch (err) {
    console.error('Error fetching modules: ', err);
    return res.status(500).json({ message: "Failed to fetch modules", error: err.message || err });
  }
});

const deleteModule = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Get the module id from the route parameter

  try {
    const module = await ModuleModel.findByIdAndDelete(id);  // Delete the module by id

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    console.log("Module Deleted: ", module);
    return res.status(200).json({ message: "Module successfully deleted" });
  } catch (err) {
    console.error('Error deleting module: ', err);
    return res.status(500).json({ message: "Failed to delete module", error: err.message || err });
  }
});

const updateModule = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Get the module id from the route parameter
  const { module_name, duration, module_description, difficulty } = req.body;

  try {
    // Find and update the module by ID
    const updatedModule = await ModuleModel.findByIdAndUpdate(id, {
      module_name,
      duration,
      module_description,
      difficulty
    }, { new: true });

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    console.log("Module Updated: ", updatedModule);
    return res.status(200).json({
      message: "Module successfully updated",
      updatedModule
    });
  } catch (err) {
    console.error('Error updating module: ', err);
    return res.status(500).json({ message: "Failed to update module", error: err.message || err });
  }
});

module.exports = {
  postModule,
  getModules,
  deleteModule,
  updateModule
};