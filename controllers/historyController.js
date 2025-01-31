const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const HistoryModel = require("../models/historyModel");

// Joi schema to validate incoming data
const historySchema = Joi.object({
  transaction: Joi.string().required(),
});

// Validation function
const validateRegistration = (data) => historySchema.validate(data);

// POST handler to add a new transaction history
const postHistory = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { transaction } = req.body;

  const history = new HistoryModel({
    transaction,
  });

  try {
    await history.save();
    console.log("New Transaction Added: ", history);
    return res.status(201).json({
      status: "success",
      message: "New Transaction Successfully Added",
      data: history,
    });
  } catch (err) {
    console.error("Error saving Transaction: ", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to add Transaction",
      error: err.message || err,
    });
  }
});

// GET handler to fetch transaction history
const getHistory = asyncHandler(async (req, res) => {
  try {
    const history = await HistoryModel.find().sort({ createdAt: -1 }); // Sorting by creation date (descending)
    if (!history.length) {
      return res.status(404).json({
        status: "fail",
        message: "No transaction history found.",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Transaction history fetched successfully.",
      data: history,
    });
  } catch (err) {
    console.error("Error fetching Transaction history: ", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch Transaction history",
      error: err.message || err,
    });
  }
});

module.exports = {
  postHistory,
  getHistory,
};
