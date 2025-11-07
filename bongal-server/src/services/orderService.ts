import Order, { IOrder } from '../models/Order';
import Product from '../models/Product';

export class OrderService {
  async createOrder(orderData: {
    userId: string;
    items: Array<{ product: string; quantity: number }>;
    shippingAddress: string;
    paymentMethod: string;
  }) {
    const { userId, items, shippingAddress, paymentMethod } = orderData;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for: ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    return order;
  }

  async getUserOrders(userId: string) {
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });
    return orders;
  }

  async getOrderById(orderId: string) {
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images');
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async getAllOrders() {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });
    return orders;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
}