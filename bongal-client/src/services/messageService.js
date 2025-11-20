import api from './api';

export const messageService = {
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  getMyMessages: async () => {
    const response = await api.get('/messages/my-messages');
    return response.data;
  },

  getConversations: async (status = '') => {
    const params = status ? { status } : {};
    const response = await api.get('/messages/conversations', { params });
    return response.data;
  },

  getUserConversation: async (userId) => {
    const response = await api.get(`/messages/conversations/${userId}`);
    return response.data;
  },

  sendMessageToUser: async (userId, message) => {
    const response = await api.post(`/messages/send/${userId}`, { message });
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};