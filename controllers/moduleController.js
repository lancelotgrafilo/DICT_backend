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

module.exports = {
  postModule
};