const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const ModuleModel = require('../models/modulesModel');

const moduleSchema = Joi.object({
  module_name: Joi.string().required(),
  module_description: Joi.string().required(),
  difficulty: Joi.string().required(),
  
});

const validateRegistration = (data) => moduleSchema.validate(data);

const postModule = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { module_name, module_description, difficulty } = req.body;

  const module = new ModuleModel({
    module_name,
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


module.exports = {
  postModule,
  getModules
};