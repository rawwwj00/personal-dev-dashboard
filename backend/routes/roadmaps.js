const router = require('express').Router();
const Roadmap = require('../models/Roadmap');
const { adminOnly, optionalAuth } = require('../middleware/auth');

// Get all roadmaps (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get single roadmap
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ error: 'Not found' });
    res.json(roadmap);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create roadmap (admin only)
router.post('/', adminOnly, async (req, res) => {
  try {
    const roadmap = new Roadmap(req.body);
    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update roadmap (admin only)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(roadmap);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete roadmap (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Roadmap.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
