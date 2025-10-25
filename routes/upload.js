const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/uploadController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/complaint-images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 4 // Maximum 4 files
  }
});

// Upload complaint images
router.post('/complaint-images', upload.array('complaintImages', 4), uploadController.uploadComplaintImages);

module.exports = router;