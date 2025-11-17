import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  notes?: string;
  transactionId?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, 'Please provide full name'],
      },
      phone: {
        type: String,
        required: [true, 'Please provide phone number'],
      },
      email: {
        type: String,
      },
      address: {
        type: String,
        required: [true, 'Please provide address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      postalCode: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please provide payment method'],
      enum: ['bKash', 'Nagad', 'Rocket', 'COD', 'Card', 'cod', 'bkash', 'nagad'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', orderSchema);
