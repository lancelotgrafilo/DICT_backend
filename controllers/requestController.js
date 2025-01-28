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
  classification: Joi.string().required(),
  modules_selected: Joi.array()
    .items(
      Joi.object({
        module_name: Joi.string().required(),
        module_description: Joi.string().allow(""),
        difficulty: Joi.string().allow("")
      })
    )
    .required(),
});

// Function to validate the request data
const validateRequest = (data) => requestSchema.validate(data);

// POST Request Handler
const postRequest = asyncHandler(async (req, res) => {
  const { error } = validateRequest(req.body);

  if (error) {
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
    classification,
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
    classification,
    modules_selected,
  });

  try {
    await request.save();
    return res.status(201).json({ message: "New Request Successfully Added", data: request });
  } catch (err) {
    console.error("Error saving Request:", err);
    return res.status(500).json({ message: "Failed to add Request", error: err.message });
  }
});

const printRequest = asyncHandler(async (req, res) => {
  try {
    // Log the start of the request processing
    console.log("Start processing request to generate Excel file");

    // Fetch all request data from the database
    const requestData = await RequestModel.find();
    console.log(`Fetched ${requestData.length} requests from the database`);

    if (!requestData || requestData.length === 0) {
      console.log("No requests found in the database");
      return res.status(404).json({ message: "No requests found" });
    }

    // Prepare the header row for the Excel file
    const data = [
      ['Salutation', 'Last Name', 'First Name', 'Middle Name', 'Extension Name', 'Gender', 'Address', 'Email Address', 'Contact Number', 'Organization Name', 'Department', 'Position', 'Date', 'Time', 'Total Hours', 'Classification', 'Modules Selected']
    ];

    // Add each request's data as a row in the Excel file
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
        request.classification,
        request.modules_selected.map(module => module.module_name).join(', '),
      ]);
    });

    // Convert to worksheet
    console.log("Converting data to worksheet");
    const ws = xlsx.utils.aoa_to_sheet(data);

    // Create a workbook
    console.log("Creating a new workbook");
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Request Data');

    // Write the file to a buffer
    console.log("Writing workbook to buffer");
    const fileBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set headers to force download in the browser
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=RequestData.xlsx');

    // Send the buffer as the file
    console.log("Sending Excel file to client");
    res.send(fileBuffer);
    console.log("Excel file sent successfully");

  } catch (err) {
    // Log any errors that occur
    console.error("Error generating Excel file:", err);
    res.status(500).json({ message: "Failed to generate Excel file", error: err.message || err });
  }
});

module.exports = {
  postRequest,
  printRequest
};
