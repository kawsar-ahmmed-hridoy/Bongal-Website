import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  content: string;
  images: string[];
  category: string;
  author: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
      trim: true
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 2;
        },
        message: 'Maximum 2 images allowed per post'
      }
    },
    category: {
      type: String,
      required: true,
      default: 'general'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    likesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    },
    sharesCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ author: 1 });

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
