const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  lastServiceStatus: {
    type: String,
    default: ''
  },
  lastServiceRequest: {
    type: String,
    default: ''
  },
  lastStatusUpdate: {
    type: Date
  },
  totalRequests: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update lastLogin on login
customerSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);