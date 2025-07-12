import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getUserProfile,
  getMyItems,
  getSwapHistory
} from '../controllers/userController.js';

const router = express.Router();

// ✅ Get logged-in user profile
router.get('/profile', protect, getUserProfile);

// ✅ Get items listed by the logged-in user
router.get('/my-items', protect, getMyItems);

// ✅ Get mock swap history (optional, placeholder)
router.get('/swaps', protect, getSwapHistory);

export default router;
