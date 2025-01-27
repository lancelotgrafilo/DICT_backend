
const express = require('express');
const router = express.Router();
const { postLogin } = require('../controllers/loginController');

router.route('/login').post(postLogin);

module.exports = router;
