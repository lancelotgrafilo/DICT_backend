const express = require("express");
const router = express.Router();

const {
  postRequest,
  printRequest,
  getRequest,
  acceptRequest,
  rejectRequest
} = require("../controllers/requestController");

router.post('/post-request', postRequest);

router.get('/print-requests', printRequest);

router.get('/get-requests', getRequest);

router.patch("/accept-request/:id", acceptRequest);
router.patch('/reject-request/:id', rejectRequest);


module.exports = router;