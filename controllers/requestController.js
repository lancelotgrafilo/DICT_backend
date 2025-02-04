// requestController.js
const asyncHandler = require('express-async-handler');
const RequestModel = require("../models/requestModel");
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

const requestSchema = Joi.object({
  salutation: Joi.string().required(),
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  middle_name: Joi.string().required(),
  extension_name: Joi.string().allow(""), 
  gender: Joi.string().required(),
  address: Joi.string().required(),
  email_address: Joi.string().email().required(),
  contact_number: Joi.string().required(),
  organization_name: Joi.string().required(),
  department: Joi.string().required(),
  position: Joi.string().required(),
  region: Joi.string().required(),
  date_and_time: Joi.array()
    .items(
      Joi.object({
        date: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
        total_hours: Joi.number().required()
      })
    )
    .required(),
  modules_selected: Joi.array()
    .items(
      Joi.object({
        module_name: Joi.string().required(),
        module_description: Joi.string().allow(""),
        difficulty: Joi.string().allow("")
      })
    )
    .required(),
  status: Joi.string().valid("pending", "accepted", "rejected", "done").default("pending"), // Default status
  statusUpdatedAt: Joi.date().allow(null).default(null), // Timestamp for status update
  pdfFile: Joi.string().required(),
});

// Function to validate the request data
const validateRequest = (data) => requestSchema.validate(data);

const postRequest = asyncHandler(async (req, res) => {
  try {
    // Parse JSON strings back into arrays/objects
    let date_and_time = [];
    let modules_selected = [];
    try {
      date_and_time = JSON.parse(req.body.date_and_time || '[]');
      modules_selected = JSON.parse(req.body.modules_selected || '[]');
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(400).json({ message: "Invalid JSON format in request payload" });
    }

    // Validate the parsed data
    const parsedBody = {
      ...req.body,
      date_and_time,
      modules_selected,
      pdfFile: req.file ? req.file.path : "", // Set pdfFile to the file path or empty string
    };

    const { error } = validateRequest(parsedBody);
    if (error) {
      console.error("Validation Error: ", error.details);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Ensure a PDF file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    // Preprocess the pdfFile field to store only the filename
    const pdfFileName = req.file ? path.basename(req.file.path) : "";

    // Extract fields from the parsed body
    const {
      salutation,
      last_name,
      first_name,
      middle_name,
      extension_name,
      gender,
      address,
      email_address,
      contact_number,
      organization_name,
      department,
      position,
      region,
    } = parsedBody;

    // Create a new request document
    const request = new RequestModel({
      salutation,
      last_name,
      first_name,
      middle_name,
      extension_name,
      gender,
      address,
      email_address,
      contact_number,
      organization_name,
      department,
      position,
      region,
      date_and_time,
      modules_selected,
      status: "pending", // Default status
      statusUpdatedAt: null, // Initially null
      pdfFile: pdfFileName, // Save only the filename in the database
    });

    // Save the request to the database
    await request.save();

    return res.status(201).json({ message: "New Request Successfully Added", data: request });
  } catch (err) {
    console.error("Error saving Request:", err);
    return res.status(500).json({ message: "Failed to add Request", error: err.message });
  }
});

const getRequest = asyncHandler(async (req, res) => {
  try {
    const requests = await RequestModel.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
});

// Accept request
const acceptRequest = asyncHandler(async (req, res) => {
  try {
    const requestId = req.params.id; // Get the request ID from the URL parameter

    // Find the request by ID and update its status to "accepted"
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status: "accepted" },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Reject request
const rejectRequest = asyncHandler(async (req, res) => {
  try {
    const requestId = req.params.id; // Get the request ID from the URL parameter

    // Find the request by ID and update its status to "rejected"
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const doneRequest = asyncHandler(async (req, res) => {
  try {
    const requestId = req.params.id; // Get the request ID from the URL parameter

    // Find the request by ID and update its status to "rejected"
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status: "done" },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = {
  postRequest,
  getRequest,
  acceptRequest,
  rejectRequest,
  doneRequest
};
