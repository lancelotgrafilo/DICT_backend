const express = require("express");
const router = express.Router();

const {
  postAdmin,
  patchAdminDetails,
  patchAdminPassword,
} = require('../controllers/adminController');

router.post("/post-admin", postAdmin);

router.patch("/patch-admin-details", patchAdminDetails);
router.patch("/patch-admin-password", patchAdminPassword);

module.exports = router;