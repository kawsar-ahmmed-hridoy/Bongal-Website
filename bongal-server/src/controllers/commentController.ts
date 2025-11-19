import { Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content: content.trim()
    });

    post.commentsCount += 1;
    await post.save();

    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        type: 'comment',
        title: 'New Comment',
        message: `${req.user.name} commented on your post`,
        post: post._id,
        comment: comment._id,
        triggerUser: req.user._id
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: populatedComment
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create comment'
    });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({ post: postId });

    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch comments'
    });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 }
    });

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete comment'
    });
  }
};
