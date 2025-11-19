export const CATEGORIES = [
  { id: 'all', name: 'All Products', name_bn: 'সব পণ্য' },
  { id: 'honey', name: 'Honey', name_bn: 'মধু' },
  { id: 'rice', name: 'Rice', name_bn: 'চাল' },
  { id: 'vegetables', name: 'Vegetables', name_bn: 'সবজি' },
  { id: 'oil', name: 'Oil', name_bn: 'তেল' },
  { id: 'handicraft', name: 'Handicrafts', name_bn: 'হস্তশিল্প' },
  { id: 'spices', name: 'Spices', name_bn: 'মসলা' },
  { id: 'dairy', name: 'Dairy', name_bn: 'দুগ্ধজাত' },
  { id: 'Molasses', name: 'Molasses', name_bn: 'খেজুরের গুড়' },
  { id: 'Others', name: 'Others', name_bn: 'অন্যান্য' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: { label: 'Pending', color: 'yellow' },
  processing: { label: 'Processing', color: 'blue' },
  shipped: { label: 'Shipped', color: 'purple' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
};

export const PAYMENT_METHODS = {
  BKASH: 'bKash',
  NAGAD: 'Nagad',
  ROCKET: 'Rocket',
  COD: 'Cash on Delivery',
  CARD: 'Credit/Debit Card',
};

export const PAYMENT_METHODS_LIST = [
  { id: 'bKash', name: 'bKash', icon: '📱' },
  { id: 'Nagad', name: 'Nagad', icon: '📱' },
  { id: 'Rocket', name: 'Rocket', icon: '🚀' },
  { id: 'COD', name: 'Cash on Delivery', icon: '💵' },
  { id: 'Card', name: 'Credit/Debit Card', icon: '💳' },
];

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
  PAYMENT: '/payment',
  REVIEWS: '/reviews',
};

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
};

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^01[3-9]\d{8}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    LOGOUT: 'Logged out successfully',
    ORDER_PLACED: 'Order placed successfully!',
    PRODUCT_ADDED: 'Product added to cart',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue',
    NOT_FOUND: 'Resource not found',
    VALIDATION: 'Please check your input',
  },
};