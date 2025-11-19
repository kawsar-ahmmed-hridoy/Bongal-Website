export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^01[3-9]\d{8}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const formatPrice = (price) => {
  return `৳${price.toLocaleString('en-BD')}`;
};

export const validateName = (name) => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const getValidationError = (field, value) => {
  const errors = {
    email: !validateEmail(value) ? 'Please enter a valid email address' : '',
    phone: !validatePhone(value) ? 'Please enter a valid BD phone number (01XXXXXXXXX)' : '',
    password: !validatePassword(value) ? 'Password must be at least 6 characters' : '',
    name: !validateName(value) ? 'Name must be between 2 and 50 characters' : '',
    required: !validateRequired(value) ? 'This field is required' : '',
  };
  return errors[field] || '';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
