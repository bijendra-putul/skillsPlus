import { Request, Response, NextFunction } from 'express';
import Contact from '../models/Contact';
import sendEmail from '../utils/email';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // Send notification email to admin
    await sendEmail({
      email: process.env.EMAIL_USER!,
      subject: `New Contact Form: ${subject}`,
      message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const status = req.query.status as string;

    const query: any = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
      return;
    }

    // Update status to read
    if (contact.status === 'pending') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to contact message
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
export const replyContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminReply } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
      return;
    }

    contact.adminReply = adminReply;
    contact.status = 'replied';
    contact.repliedAt = new Date();
    await contact.save();

    // Send reply email
    await sendEmail({
      email: contact.email,
      subject: `Re: ${contact.subject}`,
      message: adminReply,
    });

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  submitContact,
  getContacts,
  getContact,
  replyContact,
  deleteContact,
};