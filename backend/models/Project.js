const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  domain: String,
  thumbnailUrl: String,
  thumbnailCloudId: String,
  videoUrl: String,
  videoCloudId: String,
  githubUrl: String,
  liveUrl: String,
  // Toggle visibility of each feature
  showGithub: { type: Boolean, default: true },
  showVideo: { type: Boolean, default: true },
  showLive: { type: Boolean, default: true },
  tags: [String],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
