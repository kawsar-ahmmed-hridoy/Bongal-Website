import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  name_bn: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  seller: mongoose.Types.ObjectId;
  location: string;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    name_bn: {
      type: String,
      required: [true, 'Please provide Bengali name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: ['honey', 'rice', 'vegetables', 'oil', 'handicraft', 'spices', 'dairy'],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', name_bn: 'text', description: 'text' });

export default mongoose.model<IProduct>('Product', productSchema);
