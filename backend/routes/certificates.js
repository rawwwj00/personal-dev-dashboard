const router = require('express').Router();
const Certificate = require('../models/Certificate');
const { adminOnly, optionalAuth } = require('../middleware/auth');
const { uploadImage, cloudinary } = require('../middleware/upload');

// Get all certificates
router.get('/', optionalAuth, async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const certs = await Certificate.find().sort({ createdAt: -1 });
    // For guests, hide verification URL if showVerification is false
    const result = certs.map(c => {
      const obj = c.toObject();
      if (!isAdmin && !obj.showVerification) delete obj.verificationUrl;
      return obj;
    });
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Upload certificate image
router.post('/upload', adminOnly, uploadImage.single('image'), async (req, res) => {
  try {
    res.json({ url: req.file.path, publicId: req.file.filename });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create certificate
router.post('/', adminOnly, async (req, res) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.status(201).json(cert);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update certificate
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cert);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete certificate
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (cert?.cloudinaryId) await cloudinary.uploader.destroy(cert.cloudinaryId);
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
