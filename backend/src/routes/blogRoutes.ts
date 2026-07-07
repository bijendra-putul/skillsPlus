import { Router } from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
  getFeaturedBlogs,
} from '../controllers/blogController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);
router.post('/:id/comments', protect, addComment);

export default router;