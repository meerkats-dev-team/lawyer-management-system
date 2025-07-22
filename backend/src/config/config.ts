import dotenv from 'dotenv';

dotenv.config(); // تحميل المتغيرات من ملف .env

const PORT = Number(process.env.PORT!);
const MONGO_URI = process.env.MONGO_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export const config = {
  server: {
    port: PORT,
  },
  mongo: {
    uri: MONGO_URI,
  },
  jwt: {
    secret: JWT_SECRET!,
    expiresIn: JWT_EXPIRES_IN!,
  },
  cloudinary: { // سيتم استخدامه لاحقاً
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  }
};