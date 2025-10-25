const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Create a new customer
router.post('/', customerController.createCustomer);

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get customer by ID
router.get('/:id', customerController.getCustomerById);

module.exports = router;