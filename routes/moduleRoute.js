const express = require("express");
const router = express.Router();

const {
  postModule,
  getModules
} = require('../controllers/moduleController');

router.post('/post-module', postModule)

router.get("/get-module", getModules)

module.exports = router;