const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');

// Create new service request
router.post('/', serviceRequestController.createServiceRequest);

// Get service requests for a specific customer
router.get('/customer/:customerId', serviceRequestController.getCustomerServiceRequests);

// Get all service requests (for admin)
router.get('/', serviceRequestController.getAllServiceRequests);

// Update service request status
router.put('/:id', serviceRequestController.updateServiceRequestStatus);

module.exports = router;