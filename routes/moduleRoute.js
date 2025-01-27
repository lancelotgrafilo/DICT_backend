const express = require("express");
const router = express.Router();

const {
  postModule,
  getModules,
  deleteModule,
  updateModule
} = require('../controllers/moduleController');

router.post('/post-module', postModule);

router.get("/get-module", getModules);

router.delete('/delete-module/:id', deleteModule); 

router.put("/update-module/:id", updateModule);

module.exports = router;