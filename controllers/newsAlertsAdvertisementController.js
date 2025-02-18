const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const NewsAlertsAdvertisementModel = require("../models/newsAlertsAdvertisementModel");

// Joi schema to validate incoming data
const newsAlertsAdvertisementSchema = Joi.object({
  category: Joi.string().required(),
  description: Joi.string().required(),
});

// Validation function
const validateRegistration = (data) => newsAlertsAdvertisementSchema.validate(data);

// POST handler to add a new transaction newsAlertsAdvertisement
const postNewsAlertAdvertisement = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { category, description } = req.body;
  const newsAlertsAdvertisement = new NewsAlertsAdvertisementModel({
    category,
    description,
  });

  try {
    await newsAlertsAdvertisement.save();
    console.log("New News-Alerts-Advertisement Added: ", newsAlertsAdvertisement);
    return res.status(201).json({
      status: "success",
      message: "New News-Alerts-Advertisement Successfully Added",
      data: newsAlertsAdvertisement,
    });
  } catch (err) {
    console.error("Error saving News-Alerts-Advertisement: ", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to add News-Alerts-Advertisement",
      error: err.message || err,
    });
  }
});

module.exports = {
  postNewsAlertAdvertisement
};