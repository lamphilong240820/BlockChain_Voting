const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/company');
router.post('/register', CompanyController.create);
router.post('/authenticate', CompanyController.authenticate);
router.post('/endelection', CompanyController.endelection);
module.exports = router;