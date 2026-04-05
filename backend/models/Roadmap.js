const mongoose = require('mongoose');

const ChecklistItemSchema = new mongoose.Schema({
  id: String,
  text: String,
  completed: { type: Boolean, default: false }
});

const RoadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  color: { type: String, default: '#6366f1' },
  icon: { type: String, default: '🗺️' },
  items: [ChecklistItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
