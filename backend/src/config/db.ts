import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // إيقاف العملية إذا فشل الاتصال
    process.exit(1);
  }
};

export default connectDB;