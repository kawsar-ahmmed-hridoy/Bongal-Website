import api from './api';

export const paymentService = {

  initializePayment: async (paymentData) => {
    const response = await api.post('/payment/initialize', paymentData);
    return response.data;
  },

  verifyPayment: async (verificationData) => {
    const response = await api.post('/payment/verify', verificationData);
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get('/payment/methods');
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },

  initializeBkashPayment: async (amount, orderId) => {
    const response = await api.post('/payment/bkash/create', {
      amount,
      orderId,
    });
    return response.data;
  },

  initializeNagadPayment: async (amount, orderId) => {
    const response = await api.post('/payment/nagad/create', {
      amount,
      orderId,
    });
    return response.data;
  },

  initializeSSLCommerzPayment: async (paymentData) => {
    const response = await api.post('/payment/sslcommerz/init', paymentData);
    return response.data;
  },

  createStripePaymentIntent: async (amount, orderId) => {
    const response = await api.post('/payment/stripe/create-intent', {
      amount,
      orderId,
    });
    return response.data;
  },

  cancelPayment: async (paymentId) => {
    const response = await api.post(`/payment/${paymentId}/cancel`);
    return response.data;
  },

  refundPayment: async (paymentId, amount) => {
    const response = await api.post(`/payment/${paymentId}/refund`, { amount });
    return response.data;
  },
};

export default paymentService;
