const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: String,
  imageUrl: String,
  cloudinaryId: String,
  verificationUrl: String,
  showVerification: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
