const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/status-update', notificationController.sendStatusUpdate);

module.exports = router;