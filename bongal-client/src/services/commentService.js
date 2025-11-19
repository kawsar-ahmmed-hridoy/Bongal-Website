import api from './api';

export const commentService = {
  // Get comments for a post
  getComments: async (postId, page = 1, limit = 20) => {
    const response = await api.get(`/comments/${postId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Create a comment
  createComment: async (postId, content) => {
    const response = await api.post(`/comments/${postId}`, { content });
    return response.data;
  },

  // Delete own comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};
