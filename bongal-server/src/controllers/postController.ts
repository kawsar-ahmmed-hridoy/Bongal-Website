import { Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Notification from '../models/Notification';
import PostCategory from '../models/PostCategory';
import { AuthRequest } from '../middleware/auth';

// Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    console.log('createPost called');
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    const { content, images, category } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    // Images are already Cloudinary URLs from frontend
    const imageUrls = Array.isArray(images) ? images.slice(0, 2) : [];

    const post = await Post.create({
      content,
      images: imageUrls,
      category: category || 'general',
      author: req.user._id,
      status: 'pending' // Requires admin approval
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .lean();

    console.log('Post created successfully:', populatedPost);

    res.status(201).json({
      success: true,
      message: 'Post created successfully and pending approval',
      data: populatedPost
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create post'
    });
  }
};

// Get all approved posts with pagination
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;
    const userId = req.user?._id; // Get current user ID if logged in

    const query: any = { status: 'approved' };
    if (category && category !== 'all') {
      query.category = category;
    }

    // Fetch posts sorted by creation date (newest first) for consistent ordering
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 }) // Newest first - consistent ordering
      .skip(skip)
      .limit(limit)
      .lean();

    // Add isLiked flag for current user
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

// Get single post by ID
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

// Toggle like on a post
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
      // Unlike
      post.likes.splice(likeIndex, 1);
      post.likesCount -= 1;
    } else {
      // Like
      post.likes.push(userId);
      post.likesCount += 1;

      // Send notification if likes count is multiple of 10
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

// Share a post
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

// Get user's own posts
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

// Delete own post
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user is the author
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

// Admin: Get all posts (pending, approved, rejected)
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

// Admin: Update post status (approve/reject)
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

    // Send notification to post author
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

// Get all post categories
export const getPostCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await PostCategory.find().sort({ name: 1 });

    // If no categories exist, create default ones
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

// Create post category (Admin only)
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

// Delete post category (Admin only)
export const deletePostCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await PostCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Update all posts with this category to 'general'
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
