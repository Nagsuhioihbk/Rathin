const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const serviceController = require('../controllers/serviceController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes
router.post('/api/service-reports', upload.array('images', 10), serviceController.createReport);
router.get('/api/service-reports', serviceController.getAllReports);
router.get('/api/service-reports/:id', serviceController.getReportById);
router.put('/api/service-reports/:id', upload.array('images', 10), serviceController.updateReport);
router.delete('/api/service-reports/:id', serviceController.deleteReport);
router.get('/api/service-reports/download/:id', serviceController.downloadPDF);

module.exports = router;
