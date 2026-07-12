import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  saveProduct,
  removeSavedProduct,
  getSavedProducts,
} from '../controllers/userController';
import { protect, adminOnly} from '../middleware/auth';

const router = Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUser);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/save-product/:productId', protect, saveProduct);
router.delete('/save-product/:productId', protect, removeSavedProduct);
router.get('/saved-products', protect, getSavedProducts);

export default router;