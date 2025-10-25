const Customer = require('../models/Customer');

// Customer login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'No customer found with this email address'
      });
    }

    // Check if customer is active
    if (!customer.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This customer account has been deactivated'
      });
    }

    // Check password (in real app, you should hash passwords)
    if (customer.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Update last login
    await customer.updateLastLogin();

    // Login successful
    res.json({
      success: true,
      message: 'Login successful',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        lastLogin: customer.lastLogin
      }
    });

  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Verify customer token/session (optional)
exports.verifyCustomer = async (req, res) => {
  try {
    const { customerId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });

  } catch (error) {
    console.error('Verify customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};