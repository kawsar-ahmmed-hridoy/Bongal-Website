import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  isFromAdmin: boolean;
  sentBy?: mongoose.Types.ObjectId;
  status: 'unread' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
    },
    isFromAdmin: {
      type: Boolean,
      default: false,
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ user: 1, createdAt: -1 });
messageSchema.index({ status: 1 });

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
