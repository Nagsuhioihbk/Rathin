const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Customer login route
router.post('/customer-login', authController.customerLogin);

// Verify customer route
router.post('/verify-customer', authController.verifyCustomer);

module.exports = router;