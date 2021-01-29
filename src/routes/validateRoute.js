const express = require('express');

const ValidateCtrl = require('../controllers/validateCtrl');

const router = express.Router();

router.post('/validate-rule', ValidateCtrl);

module.exports = router;