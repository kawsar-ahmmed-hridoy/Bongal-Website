import api from './api';

export const postService = {
  createPost: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  sharePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/share`);
    return response.data;
  },

  getMyPosts: async () => {
    const response = await api.get('/posts/user/my-posts');
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  getAllPostsAdmin: async (status) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/posts/admin/all${params}`);
    return response.data;
  },

  updatePostStatus: async (postId, status) => {
    const response = await api.patch(`/posts/admin/${postId}/status`, { status });
    return response.data;
  },

  getPostCategories: async () => {
    const response = await api.get('/posts/categories');
    return response.data;
  },

  createPostCategory: async (name) => {
    const response = await api.post('/posts/admin/categories', { name });
    return response.data;
  },

  deletePostCategory: async (categoryId) => {
    const response = await api.delete(`/posts/admin/categories/${categoryId}`);
    return response.data;
  }
};
