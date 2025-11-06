export const formatPrice = (price: number): string => {
  return `৳${price.toLocaleString('en-BD')}`;
};

export const generateOrderId = (): string => {
  return `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

export const generateTransactionId = (): string => {
  return `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
};

export const calculateDeliveryDate = (days: number = 5): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};