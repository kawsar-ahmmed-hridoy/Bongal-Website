import api from './api';

export const reviewService = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data.reviews;
  },

  createReview: async (productId, reviewData) => {
    const response = await api.post(`/reviews/product/${productId}`, reviewData);
    return response.data.review;
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data.review;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};
