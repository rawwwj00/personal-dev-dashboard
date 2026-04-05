const router = require('express').Router();
const fs = require('fs');
const Certificate = require('../models/Certificate');
const { adminOnly, optionalAuth } = require('../middleware/auth');
const { uploadImage, cloudinary, uploadToCloudinary } = require('../middleware/upload');

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
    console.log('[UPLOAD CERTIFICATE] File received:', req.file ? 'YES' : 'NO');
    if (!req.file) {
      console.log('[UPLOAD CERTIFICATE] ERROR: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('[UPLOAD CERTIFICATE] File path:', req.file.path);
    const cloudResult = await uploadToCloudinary(req.file.path, 'devdash/certificates', 'auto');
    console.log('[UPLOAD CERTIFICATE] Cloudinary result:', cloudResult);
    
    const responseData = { 
      url: cloudResult.secure_url, 
      publicId: cloudResult.public_id 
    };
    console.log('[UPLOAD CERTIFICATE] Sending response:', JSON.stringify(responseData));
    
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
    console.error('[UPLOAD CERTIFICATE] EXCEPTION:', e.message);
    res.status(500).json({ error: e.message }); 
  }
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
