import { Request, Response, NextFunction } from 'express';
import Newsletter from '../models/Newsletter';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (!existingSubscriber.isActive) {
        existingSubscriber.isActive = true;
        existingSubscriber.unsubscribedAt = undefined;
        await existingSubscriber.save();
      }
      
      res.status(200).json({
        success: true,
        message: 'Already subscribed to newsletter',
      });
      return;
    }

    const subscriber = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully',
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   PUT /api/newsletter/unsubscribe
// @access  Public
export const unsubscribe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
      return;
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Unsubscribed from newsletter',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const subscribers = await Newsletter.find()
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Newsletter.countDocuments();

    res.status(200).json({
      success: true,
      count: subscribers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      subscribers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
export const deleteSubscriber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
};