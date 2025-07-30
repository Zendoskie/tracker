import express from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require parent authentication
router.use(authenticate);
router.use(authorize(['parent']));

// Get parent dashboard data
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    // Implementation will be added when frontend is ready
    res.json({ message: 'Parent dashboard endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

// Get children's performance
router.get('/children/performance', async (req: AuthRequest, res) => {
  try {
    // Implementation will be added when frontend is ready
    res.json({ message: 'Children performance endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

// Get children's attendance
router.get('/children/attendance', async (req: AuthRequest, res) => {
  try {
    // Implementation will be added when frontend is ready
    res.json({ message: 'Children attendance endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

export default router;