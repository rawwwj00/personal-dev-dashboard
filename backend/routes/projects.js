const router = require('express').Router();
const Project = require('../models/Project');
const { adminOnly, optionalAuth } = require('../middleware/auth');
const { uploadImage, uploadVideo, cloudinary } = require('../middleware/upload');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, order: 1, createdAt: -1 });
    res.json(projects);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/upload/thumbnail', adminOnly, uploadImage.single('image'), async (req, res) => {
  try {
    console.log('[UPLOAD thumbnail] req.file:', JSON.stringify(req.file, null, 2));
    const url = req.file.secure_url || req.file.path;
    const publicId = req.file.public_id || req.file.filename;
    console.log('[UPLOAD thumbnail] returning url:', url);
    res.json({ url, publicId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/upload/video', adminOnly, uploadVideo.single('video'), async (req, res) => {
  try {
    console.log('[UPLOAD video] req.file:', JSON.stringify(req.file, null, 2));
    const url = req.file.secure_url || req.file.path;
    const publicId = req.file.public_id || req.file.filename;
    console.log('[UPLOAD video] returning url:', url);
    res.json({ url, publicId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', adminOnly, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (p?.thumbnailCloudId) await cloudinary.uploader.destroy(p.thumbnailCloudId);
    if (p?.videoCloudId) await cloudinary.uploader.destroy(p.videoCloudId, { resource_type: 'video' });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
