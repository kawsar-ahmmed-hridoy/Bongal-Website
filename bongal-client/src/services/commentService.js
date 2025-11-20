import api from './api';

export const commentService = {
  getComments: async (postId, page = 1, limit = 20) => {
    const response = await api.get(`/comments/${postId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  createComment: async (postId, content) => {
    const response = await api.post(`/comments/${postId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};
