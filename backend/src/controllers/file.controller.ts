import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import File from '../models/File.schema';
import cloudinary from '../config/cloudinary';

// @desc    رفع ملف جديد وربطه بقضية
// @route   POST /api/v1/cases/:caseId/files
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
       res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'No file uploaded.' });
    return
    }

    const { originalname, path, mimetype, filename } = req.file;
    const { description } = req.body;
    const { caseId } = req.params;
    const ownerId = req.user!._id;

    // `path` هو الرابط الذي يرجعه Cloudinary
    // `filename` هو الـ publicId الذي يرجعه Cloudinary
    const newFile = await File.create({
      fileName: originalname,
      fileUrl: path,
      fileType: mimetype,
      publicId: filename,
      description,
      caseId,
      ownerId,
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: newFile });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب كل الملفات لقضية محددة
// @route   GET /api/v1/cases/:caseId/files
export const getFilesForCase = async (req: Request, res: Response, next: NextFunction) => {
  const { caseId } = req.params;
  try {
    const files = await File.find({ caseId })
        .sort({ createdAt: 'desc' })
    res.status(StatusCodes.OK).json({ success: true, count: files.length, data: files });
  } catch (error) {
    next(error);
  }
};

// @desc    حذف ملف محدد
// @route   DELETE /api/v1/cases/:caseId/files/:fileId
export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  const { fileId } = req.params;
  const ownerId = req.user!._id;

  try {
    // 1. ابحث عن الملف في قاعدة بياناتنا للتأكد من أنه يخص المستخدم
    const fileToDelete = await File.findOne({ _id: fileId, ownerId });
    if (!fileToDelete) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'File not found or you do not have permission to delete it.' });
    
    return}

    // 2. احذف الملف من Cloudinary باستخدام publicId
    await cloudinary.uploader.destroy(fileToDelete.publicId);

    // 3. احذف سجل الملف من قاعدة بياناتنا
    await fileToDelete.deleteOne();

    res.status(StatusCodes.OK).json({ success: true, message: 'File deleted successfully.' });
  } catch (error) {
    next(error);
  }
};