import mongoose, { Document, Schema } from 'mongoose';

export interface IPostCategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const postCategorySchema = new Schema<IPostCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const PostCategory = mongoose.model<IPostCategory>('PostCategory', postCategorySchema);

export default PostCategory;
