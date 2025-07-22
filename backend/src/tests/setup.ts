import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection is not established.');
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// تشغيل قاعدة بيانات وهمية قبل جميع ملفات الاختبار
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// إغلاق الاتصال وقاعدة البيانات بعد انتهاء جميع ملفات الاختبار
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

