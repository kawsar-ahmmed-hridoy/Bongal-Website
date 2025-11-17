import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

export const createOrder = async (req: any, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, notes } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address',
      });
    }

    // Verify products exist and calculate total
    let calculatedTotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }
      calculatedTotal += product.price * item.quantity;
    }

    const orderData: any = {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount: totalAmount || calculatedTotal,
      notes,
    };

    // Add user ID if authenticated
    if (req.user && req.user.id) {
      orderData.user = req.user.id;
    }

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
};

export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get orders',
    });
  }
};

export const getOrderById = async (req: any, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization - only allow if user owns the order or is admin
    if (order.user && order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    // For guest orders (no user), only admin can view
    if (!order.user && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get order',
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get orders',
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order',
    });
  }
};
