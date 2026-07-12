import express, { Router, Request, Response } from 'express';
import Category from '../models/Category';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router: Router = express.Router();

// GET all categories (public)
// Line 8
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET single category (public)
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE category (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, slug, description, icon, image, seoTitle, seoDescription } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    const existingCategory = await Category.findOne({
      $or: [{ slug }, { name }],
    });

    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug,
      description,
      icon,
      image,
      seoTitle,
      seoDescription,
      productCount: 0,
    });

    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE category (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE category (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
