const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/complaint-images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.uploadComplaintImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Check if more than 4 images
    if (req.files.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 4 images allowed'
      });
    }

    const imageUrls = req.files.map(file => {
      return `/uploads/complaint-images/${file.filename}`;
    });

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      imageUrls: imageUrls
    });

  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images'
    });
  }
};