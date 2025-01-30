const asyncHandler = require('express-async-handler');
const RequestModel = require("../models/requestModel");
const Joi = require('joi');
const xlsx = require('xlsx');

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
});

// Function to validate the request data
const validateRequest = (data) => requestSchema.validate(data);

// POST Request Handler
const postRequest = asyncHandler(async (req, res) => {
  const { error } = validateRequest(req.body);
  if (error) {
    console.error("Validation Error: ", error.details);  
    return res.status(400).json({ message: error.details[0].message });
  }

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
    date_and_time,
    modules_selected,
  } = req.body;

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
    date_and_time,
    modules_selected,
    status: "pending", // Default status
    statusUpdatedAt: null, // Initially null
  });

  try {
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

const printRequest = asyncHandler(async (req, res) => {
  try {
    console.log("Start processing request to generate Excel file");

    const requestData = await RequestModel.find();
    console.log(`Fetched ${requestData.length} requests from the database`);

    if (!requestData || requestData.length === 0) {
      console.log("No requests found in the database");
      return res.status(404).json({ message: "No requests found" });
    }

    const data = [
      ['Salutation', 'Last Name', 'First Name', 'Middle Name', 'Extension Name', 'Gender', 'Address', 'Email Address', 'Contact Number', 'Organization Name', 'Department', 'Position', 'Date', 'Time', 'Total Hours', 'Status', 'Status Updated At', 'Modules Selected']
    ];

    requestData.forEach(request => {
      console.log(`Processing request for ${request.first_name} ${request.last_name}`);
      data.push([
        request.salutation,
        request.last_name,
        request.first_name,
        request.middle_name,
        request.extension_name,
        request.gender,
        request.address,
        request.email_address,
        request.contact_number,
        request.organization_name,
        request.department,
        request.position,
        request.date,
        request.time,
        request.total_hours,
        request.status, // Include status in the export
        request.statusUpdatedAt ? request.statusUpdatedAt.toISOString() : "N/A", // Include status update timestamp
        request.modules_selected.map(module => module.module_name).join(', '),
      ]);
    });

    console.log("Converting data to worksheet");
    const ws = xlsx.utils.aoa_to_sheet(data);

    console.log("Creating a new workbook");
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Request Data');

    console.log("Writing workbook to buffer");
    const fileBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=RequestData.xlsx');

    console.log("Sending Excel file to client");
    res.send(fileBuffer);
    console.log("Excel file sent successfully");

  } catch (err) {
    console.error("Error generating Excel file:", err);
    res.status(500).json({ message: "Failed to generate Excel file", error: err.message || err });
  }
});

module.exports = {
  postRequest,
  printRequest,
  getRequest,
  acceptRequest,
  rejectRequest
};
