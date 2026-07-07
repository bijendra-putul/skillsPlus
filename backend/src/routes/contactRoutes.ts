import { Router } from 'express';
import {
  submitContact,
  getContacts,
  getContact,
  replyContact,
  deleteContact,
} from '../controllers/contactController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.get('/:id', protect, adminOnly, getContact);
router.put('/:id/reply', protect, adminOnly, replyContact);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;