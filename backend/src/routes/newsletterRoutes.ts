import { Router } from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
} from '../controllers/newsletterController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.post('/', subscribe);
router.put('/unsubscribe', unsubscribe);
router.get('/', protect, adminOnly, getSubscribers);
router.delete('/:id', protect, adminOnly, deleteSubscriber);

export default router;