const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  category: { type: String, required: true },
  icon: String, // emoji or URL
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tool', ToolSchema);
