// requestRoute.js
const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/uploadMiddleware");

const {
  postRequest,
  getRequestPdf,
  getRequest,
  acceptRequest,
  rejectRequest,
  doneRequest,
  cancelRequest
} = require("../controllers/requestController");

router.post('/post-request', upload.single('pdfFile'), postRequest);

router.get('/get-pdf/:id', getRequestPdf);
router.get('/get-requests', getRequest);

router.patch("/accept-request/:id", acceptRequest);
router.patch('/reject-request/:id', rejectRequest);
router.patch('/done-request/:id', doneRequest);
router.patch('/canceled-request/:id', cancelRequest);

module.exports = router;