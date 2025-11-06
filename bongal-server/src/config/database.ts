import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bongal';
    
    await mongoose.connect(mongoURI);
    
    console.log(`MongoDB connected successfully to Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Couldn\'t connect to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;