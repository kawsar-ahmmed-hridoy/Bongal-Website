export interface OrderItemDTO {
  product: string;
  quantity: number;
  price: number;
}

export interface CreateOrderDTO {
  items: Array<{ product: string; quantity: number }>;
  shippingAddress: string;
  paymentMethod: string;
}

export interface OrderDTO {
  id: string;
  user: string;
  items: OrderItemDTO[];
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  transactionId?: string;
  createdAt: Date;
}
