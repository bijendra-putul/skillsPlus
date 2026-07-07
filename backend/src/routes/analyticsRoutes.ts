import { Router } from 'express';
import {
  getDashboardStats,
  getProductAnalytics,
  getClickHistory,
} from '../controllers/analyticsController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/products', protect, adminOnly, getProductAnalytics);
router.get('/clicks', protect, adminOnly, getClickHistory);

export default router;