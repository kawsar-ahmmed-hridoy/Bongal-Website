export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidBDPhone = (phone: string): boolean => {
  const re = /^01[3-9]\d{8}$/;
  return re.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};