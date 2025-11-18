import api from './api';

export const postService = {
  // Create a new post
  createPost: async (postData) => {
    console.log('postService.createPost called with:', postData);
    console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
    try {
      const response = await api.post('/posts', postData);
      console.log('Post creation response:', response);
      return response.data;
    } catch (error) {
      console.error('Post creation error in service:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.response?.data?.message);
      throw error;
    }
  },

  // Get all approved posts with filters
  getPosts: async ({ page = 1, limit = 10, category = 'all', sortBy = 'popular' } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy
    });

    if (category !== 'all') {
      params.append('category', category);
    }

    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Get single post by ID
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Toggle like on a post
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Share a post
  sharePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/share`);
    return response.data;
  },

  // Get user's own posts
  getMyPosts: async () => {
    const response = await api.get('/posts/user/my-posts');
    return response.data;
  },

  // Delete own post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Admin: Get all posts
  getAllPostsAdmin: async (status) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/posts/admin/all${params}`);
    return response.data;
  },

  // Admin: Update post status
  updatePostStatus: async (postId, status) => {
    const response = await api.patch(`/posts/admin/${postId}/status`, { status });
    return response.data;
  }
};
