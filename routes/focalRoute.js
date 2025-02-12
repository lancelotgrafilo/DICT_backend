const express = require("express");
const router = express.Router();
const { uploadFocal } = require("../middlewares/uploadMiddleware");

const {
  postFocal,
  patchFocalDetails,
  patchFocalPassword,
} = require('../controllers/focalController');

router.post('/post-focal', uploadFocal.single('pdfFile'), postFocal);

router.patch("/patch-focal-details", patchFocalDetails);
router.patch("/patch-focal-password", patchFocalPassword);

module.exports = router;
