import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get reviews',
    });
  }
};

export const createReview = async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    // Update product rating and numReviews
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    product.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
    product.numReviews = reviews.length;
    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: populatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create review',
    });
  }
};

export const updateReview = async (req: any, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews',
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: review.product });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      rating: Math.round(avgRating * 10) / 10,
    });

    const updatedReview = await Review.findById(reviewId).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update review',
    });
  }
};

export const deleteReview = async (req: any, res: Response) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews',
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating and numReviews
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete review',
    });
  }
};
