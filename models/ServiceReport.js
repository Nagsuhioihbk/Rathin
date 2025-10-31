const mongoose = require('mongoose');

// Counter schema for auto-incrementing slNo
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const serviceReportSchema = new mongoose.Schema({
  slNo: { type: Number, unique: true, sparse: true },
  date: { type: Date, required: true },
  billDate: Date,
  billNo: String,
  maintenanceType: String,
  
  // Outlet Details
  outletName: String,
  outletAddress: String,
  contactPerson: String,
  contactNumber: String,
  
  // Machine Details
  machineType: String,
  machineModel: String,
  machineSerialNumber: String,
  complaintDate: Date,
  installationDate: Date,
  
  // Technical Specifications
  waterInputTDS: String,
  waterPressure: String,
  waterSource: String,
  electricalSupply: String,
  powerFluctuation: String,
  
  // Fault Analysis
  customerComplaint: String,
  actualFault: String,
  actionTaken: String,
  
  // Spare Parts & Equipment
  spareParts: [String],
  equipments: [String],
  
  // Remarks
  serviceRemarks: String,
  customerRemarks: String,
  
  // Signatures
  userName: String,
  userDate: Date,
  userSignature: String,
  engineeringName: String,
  engineeringDate: Date,
  engineeringSignature: String,
  serviceEngineerName: String,
  serviceEngineerDate: Date,
  
  // Images
  images: [{ 
    filename: String,
    path: String,
    mimetype: String
  }],
  beforeServiceImages: [{
    filename: String,
    path: String,
    mimetype: String,
    type: { type: String, default: 'before' }
  }],
  afterServiceImages: [{
    filename: String,
    path: String,
    mimetype: String,
    type: { type: String, default: 'after' }
  }],
  
  // PDF File Path - ADDED THIS
  filePath: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-increment hook
serviceReportSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'slNo',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.slNo = counter.seq;
    } catch (error) {
      console.error('Error incrementing slNo:', error);
      next(error);
    }
  }
  next();
});

module.exports = mongoose.model('ServiceReport', serviceReportSchema);