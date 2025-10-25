const Customer = require('../models/Customer');

exports.sendStatusUpdate = async (req, res) => {
  try {
    const {
      customerEmail,
      customerName,
      requestId,
      serviceType,
      newStatus,
      previousStatus
    } = req.body;

    // Here you would integrate with your email service
    // For now, we'll just log the notification
    console.log('Status Update Notification:', {
      customerEmail,
      customerName,
      requestId,
      serviceType,
      previousStatus,
      newStatus,
      timestamp: new Date().toISOString()
    });

    // Update customer's last status in database
    await Customer.findOneAndUpdate(
      { email: customerEmail },
      { 
        $set: { 
          lastServiceStatus: newStatus,
          lastServiceRequest: requestId,
          lastStatusUpdate: new Date()
        }
      }
    );

    res.json({
      success: true,
      message: 'Status update notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending status update:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending status update notification'
    });
  }
};