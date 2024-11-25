const express = require('express');
const { authenticateRole } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/user', authenticateRole(['user']), (req, res) => {
  res.json({ message: `Welcome ${req.user.role}` });
});

module.exports = router;
