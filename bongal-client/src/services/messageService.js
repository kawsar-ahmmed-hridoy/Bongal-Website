import api from './api';

export const messageService = {
  // Send a message (authenticated users only)
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Get user's own messages
  getMyMessages: async () => {
    const response = await api.get('/messages/my-messages');
    return response.data;
  },

  // Admin: Get conversations grouped by user
  getConversations: async (status = '') => {
    const params = status ? { status } : {};
    const response = await api.get('/messages/conversations', { params });
    return response.data;
  },

  // Admin: Get conversation with specific user
  getUserConversation: async (userId) => {
    const response = await api.get(`/messages/conversations/${userId}`);
    return response.data;
  },

  // Admin: Send message to user
  sendMessageToUser: async (userId, message) => {
    const response = await api.post(`/messages/send/${userId}`, { message });
    return response.data;
  },

  // Admin: Delete message
  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};