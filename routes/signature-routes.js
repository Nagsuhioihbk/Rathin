// signature-routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/signatures';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = 'admin-signature-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// In-memory storage for signature data (replace with database in production)
let currentSignature = null;

// GET - Fetch current admin signature
router.get('/admin-signature', (req, res) => {
  if (currentSignature) {
    res.json(currentSignature);
  } else {
    res.status(404).json({ message: 'No signature found' });
  }
});

// POST - Upload new admin signature
router.post('/admin-signature/upload', upload.single('signature'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Delete old signature file if exists
    if (currentSignature && currentSignature.filepath) {
      const oldFilePath = currentSignature.filepath;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Create new signature data
    const signatureData = {
      id: Date.now().toString(),
      filename: req.file.filename,
      filepath: req.file.path,
      url: `/uploads/signatures/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    currentSignature = signatureData;

    res.status(200).json(signatureData);
  } catch (error) {
    console.error('Error uploading signature:', error);
    res.status(500).json({ message: 'Failed to upload signature' });
  }
});

// DELETE - Delete admin signature
router.delete('/admin-signature/:id', (req, res) => {
  try {
    if (!currentSignature) {
      return res.status(404).json({ message: 'No signature to delete' });
    }

    // Delete file from filesystem
    if (currentSignature.filepath && fs.existsSync(currentSignature.filepath)) {
      fs.unlinkSync(currentSignature.filepath);
    }

    currentSignature = null;

    res.status(200).json({ message: 'Signature deleted successfully' });
  } catch (error) {
    console.error('Error deleting signature:', error);
    res.status(500).json({ message: 'Failed to delete signature' });
  }
});

module.exports = router;