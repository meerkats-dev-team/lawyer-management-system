import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { Request } from 'express';

interface CustomParams {
  folder: (req: Request, file: Express.Multer.File) => string;
  allowed_formats: string[];
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // تحديد المجلد في Cloudinary بشكل ديناميكي بناءً على caseId
    folder: (req: Request, file: Express.Multer.File) => `law_firm_app/cases/${req.params.caseId}`,
    // تحديد الصيغ المسموح بها
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
    // يمكن استخدام public_id لتسمية الملف، لكننا سنعتمد على التسمية التلقائية من Cloudinary لضمان التفرد
  } as CustomParams,
});

// إعداد middleware الرفع مع تحديد حجم أقصى للملف (مثلاً 10MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 Megabytes
  fileFilter: (req, file, cb) => {
    // يمكنك إضافة منطق فلترة إضافي هنا إذا أردت
    cb(null, true);
  },
});

export default upload;