import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save product to user's saved list
// @route   POST /api/users/save-product/:productId
// @access  Private
export const saveProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const productId = req.params.productId;
    
    // Check if product is already saved
    if (user.savedProducts.includes(productId as any)) {
      res.status(400).json({
        success: false,
        message: 'Product already saved',
      });
      return;
    }

    user.savedProducts.push(productId as any);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from user's saved list
// @route   DELETE /api/users/save-product/:productId
// @access  Private
export const removeSavedProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    user.savedProducts = user.savedProducts.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from saved list',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved products
// @route   GET /api/users/saved-products
// @access  Private
export const getSavedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req as any).user._id)
      .populate('savedProducts', 'title slug price discount rating images');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      products: user.savedProducts,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  saveProduct,
  removeSavedProduct,
  getSavedProducts,
};