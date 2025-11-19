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

// Get all conversations grouped by user (admin only)
export const getConversations = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    // Aggregate messages by user
    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$user',
          userName: { $first: '$userDetails.name' },
          userEmail: { $first: '$userDetails.email' },
          userPhone: { $first: '$userDetails.phone' },
          lastMessage: { $first: '$message' },
          lastMessageDate: { $first: '$createdAt' },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] }
          },
          totalMessages: { $sum: 1 },
          hasUnread: {
            $max: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 1,
          userName: 1,
          userEmail: 1,
          userPhone: 1,
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1,
          totalMessages: 1,
          hasUnread: 1
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      }
    ];

    // Apply status filter if provided
    if (status && ['unread', 'read', 'replied'].includes(status as string)) {
      pipeline.unshift({ $match: { status } });
    }

    const conversations = await Message.aggregate(pipeline);

    const stats = {
      total: await Message.countDocuments(),
      unread: await Message.countDocuments({ status: 'unread' }),
      read: await Message.countDocuments({ status: 'read' }),
      replied: await Message.countDocuments({ status: 'replied' }),
      totalUsers: conversations.length,
    };

    res.json({
      success: true,
      conversations,
      stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch conversations',
    });
  }
};

// Get conversation with a specific user (admin only)
export const getUserConversation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ user: userId })
      .populate('user', 'name email phone')
      .populate('repliedBy', 'name')
      .sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No messages found for this user',
      });
    }

    // Mark unread messages as read
    await Message.updateMany(
      { user: userId, status: 'unread' },
      { status: 'read' }
    );

    res.json({
      success: true,
      messages,
      user: messages[0]?.user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch conversation',
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
    const messages = await Message.find({ user: req.user?._id })
      .populate('repliedBy', 'name')
      .sort({ createdAt: 1 });

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

// Reply to message (admin only)
export const replyToMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    message.adminReply = reply.trim();
    message.repliedBy = req.user?._id;
    message.repliedAt = new Date();
    message.status = 'replied';
    await message.save();

    const populatedMessage = await Message.findById(id)
      .populate('user', 'name email phone')
      .populate('repliedBy', 'name');

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: populatedMessage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send reply',
    });
  }
};

// Send message to user (admin only)
export const sendMessageToUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Get user details
    const User = require('../models/User').default;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create a new message from admin to user
    const newMessage = await Message.create({
      user: userId,
      name: user.name,
      email: user.email,
      subject: 'Message from Admin',
      message: message.trim(),
      adminReply: '',
      status: 'replied',
      repliedBy: req.user?._id,
      repliedAt: new Date(),
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('user', 'name email phone')
      .populate('repliedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
};
