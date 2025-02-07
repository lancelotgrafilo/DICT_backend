const express = require("express");
const router = express.Router();

const {
  postFocal,
  patchFocalDetails,
  patchFocalPassword,
} = require('../controllers/focalController');

router.post("/post-focal", postFocal);

router.patch("/patch-focal-details", patchFocalDetails);
router.patch("/patch-focal-password", patchFocalPassword);

module.exports = router;
