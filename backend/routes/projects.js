const router = require('express').Router();
const fs = require('fs');
const Project = require('../models/Project');
const { adminOnly, optionalAuth } = require('../middleware/auth');
const { uploadImage, uploadVideo, cloudinary, uploadToCloudinary, uploadDir } = require('../middleware/upload');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, order: 1, createdAt: -1 });
    res.json(projects);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/upload/thumbnail', adminOnly, uploadImage.single('image'), async (req, res) => {
  try {
    console.log('[UPLOAD THUMBNAIL] File received:', req.file ? 'YES' : 'NO');
    if (!req.file) {
      console.log('[UPLOAD THUMBNAIL] ERROR: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('[UPLOAD THUMBNAIL] File path:', req.file.path);
    const cloudResult = await uploadToCloudinary(req.file.path, 'devdash', 'auto');
    console.log('[UPLOAD THUMBNAIL] Cloudinary result:', cloudResult);
    
    const responseData = { 
      thumbnailUrl: cloudResult.secure_url, 
      thumbnailCloudId: cloudResult.public_id 
    };
    console.log('[UPLOAD THUMBNAIL] Sending response:', JSON.stringify(responseData));
    
    // Clean up temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('[TEMP FILE DELETE ERROR]', err.message);
    });
    
    res.json(responseData);
  } catch (e) { 
    // Clean up temp file on error
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    console.error('[UPLOAD THUMBNAIL] EXCEPTION:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

router.post('/upload/video', adminOnly, uploadVideo.single('video'), async (req, res) => {
  try {
    console.log('[UPLOAD VIDEO] File received:', req.file ? 'YES' : 'NO');
    if (!req.file) {
      console.log('[UPLOAD VIDEO] ERROR: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('[UPLOAD VIDEO] File path:', req.file.path);
    const cloudResult = await uploadToCloudinary(req.file.path, 'devdash/videos', 'video');
    
    // Clean up temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('[TEMP FILE DELETE ERROR]', err.message);
    });
    
    res.json({ 
      videoUrl: cloudResult.secure_url, 
      videoCloudId: cloudResult.public_id 
    });
  } catch (e) { 
    // Clean up temp file on error
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
    console.error('[UPLOAD VIDEO] EXCEPTION:', e.message);
    res.status(500).json({ error: e.message }); 
  }
});

router.post('/', adminOnly, async (req, res) => {
  try {
    console.log('[CREATE PROJECT] Received body:', JSON.stringify(req.body, null, 2));
    const project = new Project(req.body);
    await project.save();
    console.log('[CREATE PROJECT] Saved project:', JSON.stringify(project, null, 2));
    res.status(201).json(project);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    console.log('[UPDATE PROJECT] ID:', req.params.id, 'Body:', JSON.stringify(req.body, null, 2));
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('[UPDATE PROJECT] Updated project:', JSON.stringify(project, null, 2));
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
