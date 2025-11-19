import { Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Notification from '../models/Notification';
import PostCategory from '../models/PostCategory';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, images, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    const imageUrls = Array.isArray(images) ? images.slice(0, 2) : [];

    const post = await Post.create({
      content,
      images: imageUrls,
      category: category || 'general',
      author: req.user._id,
      status: 'pending'
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Post created successfully and pending approval',
      data: populatedPost
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create post'
    });
  }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;
    const userId = req.user?._id;

    const query: any = { status: 'approved' };
    if (category && category !== 'all') {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLiked: userId ? post.likes.some((likeId: any) => likeId.toString() === userId.toString()) : false
    }));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: postsWithLikeStatus,
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
      message: error.message || 'Failed to fetch posts'
    });
  }
};

export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch post'
    });
  }
};

export const toggleLikePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      post.likesCount -= 1;
    } else {
      post.likes.push(userId);
      post.likesCount += 1;

      if (post.likesCount % 10 === 0 && post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          type: 'like',
          title: 'Post Milestone!',
          message: `Your post has reached ${post.likesCount} likes!`,
          post: post._id,
          triggerUser: userId
        });
      }
    }

    await post.save();

    res.json({
      success: true,
      data: {
        likesCount: post.likesCount,
        isLiked: likeIndex === -1
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle like'
    });
  }
};

export const sharePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.sharesCount += 1;
    await post.save();

    res.json({
      success: true,
      data: {
        sharesCount: post.sharesCount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to share post'
    });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: posts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch posts'
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: post._id });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete post'
    });
  }
};

export const getAllPostsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: posts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch posts'
    });
  }
};

export const updatePostStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (status === 'approved') {
      await Notification.create({
        recipient: post.author._id,
        type: 'post_approved',
        title: 'Post Approved!',
        message: 'Your post has been approved and is now visible to everyone',
        post: post._id
      });
    }

    res.json({
      success: true,
      message: `Post ${status} successfully`,
      data: post
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update post status'
    });
  }
};

export const getPostCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await PostCategory.find().sort({ name: 1 });

    if (categories.length === 0) {
      const defaultCategories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Food & Dining'];
      await PostCategory.insertMany(defaultCategories.map(name => ({ name })));
      const newCategories = await PostCategory.find().sort({ name: 1 });
      return res.json({
        success: true,
        data: newCategories
      });
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
};

export const createPostCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const existingCategory = await PostCategory.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = await PostCategory.create({ name: name.trim() });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category'
    });
  }
};

export const deletePostCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await PostCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Post.updateMany(
      { category: category.name },
      { category: 'general' }
    );

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category'
    });
  }
};
