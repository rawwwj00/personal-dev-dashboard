const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin login
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  
  const isMatch = await bcrypt.compare(password, 
    await bcrypt.hash(process.env.ADMIN_PASSWORD, 10).then(() => {
      // Compare directly
      return bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    })
  );
  
  // Simple direct comparison (no hash needed for single password)
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  
  const token = jwt.sign({ role: 'admin', id: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: 'admin' });
});

// Guest access
router.post('/guest', (req, res) => {
  const token = jwt.sign({ role: 'guest', id: 'guest_' + Date.now() }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, role: 'guest' });
});

// Verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, role: user.role });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
