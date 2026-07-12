import { Request, Response, NextFunction } from 'express';
import Analytics from '../models/Analytics';
import Product from '../models/Product';
import Blog from '../models/Blog';
import User from '../models/User';
import Category from '../models/Category';

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments();
    const totalBlogs = await Blog.countDocuments({ isPublished: true });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalClicks = await Analytics.countDocuments();

    // Most clicked products
    const mostClickedProducts = await Product.find({ isActive: true })
      .sort('-clickCount')
      .limit(5)
      .select('title clickCount');

    // Daily visits (last 30 days)
    const dailyVisits = await Analytics.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          clicks: { $sum: '$clicks' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly visits
    const monthlyVisits = await Analytics.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          clicks: { $sum: '$clicks' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalBlogs,
        totalUsers,
        totalClicks,
        mostClickedProducts,
        dailyVisits,
        monthlyVisits,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
export const getProductAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const analytics = await Analytics.aggregate([
      {
        $group: {
          _id: '$product',
          totalClicks: { $sum: '$clicks' },
        },
      },
      { $sort: { totalClicks: -1 } },
      { $limit: 10 },
    ]);

    const productIds = analytics.map((a) => a._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .select('title clickCount');

    res.status(200).json({
      success: true,
      analytics: analytics.map((a, i) => ({
        product: products[i],
        clicks: a.totalClicks,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get click history
// @route   GET /api/analytics/clicks
// @access  Private/Admin
export const getClickHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const clicks = await Analytics.find()
      .populate('product', 'title')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Analytics.countDocuments();

    res.status(200).json({
      success: true,
      count: clicks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      clicks,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getProductAnalytics,
  getClickHistory,
};