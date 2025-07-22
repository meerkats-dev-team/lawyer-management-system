import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from './config/config'; // سيتم إنشاؤه لاحقاً
import connectDB from './config/db';
import authRoutes from './routes/auth.route';
import clientRoutes from './routes/client.route'; // <-- إضافة جديدة
import caseRoutes from './routes/case.route'; // <-- إضافة جديدة
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// تهيئة تطبيق Express
const app: Application = express();

// Middlewares أساسية
app.use(express.json()); // لتحليل JSON bodies
app.use(express.urlencoded({ extended: true })); // لتحليل URL-encoded bodies


// ---- Routes ----
app.use('/api/v1/auth', authRoutes); // استخدام مسارات التوثيق
app.use('/api/v1/clients', clientRoutes); // <-- إضافة جديدة
app.use('/api/v1/cases', caseRoutes); // <-- إضافة جديدة
// إعداد Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }', // لإخفاء شريط Swagger العلوي
    customSiteTitle: "Law Firm API Docs"
}));
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Law Firm API v1!' });
});

// اختبار Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Law Firm API!' });
});

// معالج الأخطاء العام
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


// تشغيل الخادم
const PORT = config.server.port || 5001; // سيتم تعريف المتغيرات في الخطوة التالية

const startServer = async () => {
  try {
    // 1. الاتصال بقاعدة البيانات أولاً
    await connectDB();
    console.log('Database connected successfully.');

    // 2. بعد نجاح الاتصال، قم بتشغيل الخادم
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${config.server.port}`);
      if (process.env.NODE_ENV !== 'test') {
        console.log(`API Docs available at http://localhost:${config.server.port}/api-docs`);
      }
    });

  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;