import type { Request, Response } from 'express';
import Message from '../models/Message';

interface AuthRequest extends Request {
  user?: any;
}

// Create a new message (authenticated users only)
export const createMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const newMessage = await Message.create({
      user: req.user?._id,
      name: req.user?.name,
      email: req.user?.email,
      subject: subject || '',
      message: message.trim(),
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: newMessage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
};

// Get all messages (admin only)
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const filter: any = {};
    if (status && ['unread', 'read', 'replied'].includes(status as string)) {
      filter.status = status;
    }

    const messages = await Message.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    const stats = {
      total: await Message.countDocuments(),
      unread: await Message.countDocuments({ status: 'unread' }),
      read: await Message.countDocuments({ status: 'read' }),
      replied: await Message.countDocuments({ status: 'replied' }),
    };

    res.json({
      success: true,
      messages,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch messages',
    });
  }
};

// Get single message (admin only)
export const getMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id).populate('user', 'name email phone address');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Mark as read if it was unread
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.json({
      success: true,
      message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch message',
    });
  }
};

// Update message status (admin only)
export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'name email phone');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message status updated',
      data: message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update message status',
    });
  }
};

// Delete message (admin only)
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete message',
    });
  }
};

// Get messages by current user (authenticated users)
export const getUserMessages = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({ user: req.user?._id }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your messages',
    });
  }
};
