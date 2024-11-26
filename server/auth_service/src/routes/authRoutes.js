import express from 'express';
import { authenticateRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', authenticateRole(['user']), (req, res) => {
    res.json({ message: `Welcome ${req.user.role}` });
});

export default router;