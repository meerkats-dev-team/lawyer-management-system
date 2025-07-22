import { Schema, model, Document, Types } from 'mongoose';
import { ICase } from './Case.schema';
import { IUser } from './User.schema';

export interface IFile extends Document {
  fileName: string;
  fileUrl: string;
  publicId: string; // ID الملف في Cloudinary (مهم جدًا للحذف)
  fileType: string;
  description?: string;
  caseId: Types.ObjectId | ICase;
  ownerId: Types.ObjectId | IUser; // لطبقة إضافية من التحقق
}

const fileSchema = new Schema<IFile>(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    fileType: { type: String, required: true },
    description: { type: String, trim: true },
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const File = model<IFile>('File', fileSchema);
export default File;