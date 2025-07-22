import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User.schema'; // استيراد الواجهة لربط النوع

// واجهة لتعريف معلومات الاتصال
interface IContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

// واجهة لتعريف حقول العميل في TypeScript
export interface IClient extends Document {
  name: string;
  contactInfo: IContactInfo;
  ownerId: Types.ObjectId | IUser; // يمكن أن يكون ObjectId أو كائن مستخدم كامل
  createdAt: Date;
  updatedAt: Date;
}

const contactInfoSchema = new Schema<IContactInfo>(
  {
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
  },
  { _id: false }, // لا تنشئ _id لكائن الاتصال المدمج
);

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    contactInfo: {
      type: contactInfoSchema,
      default: {},
    },
    
    // ربط العميل بالمستخدم الذي أنشأه
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // يشير إلى نموذج 'User'
      required: true,
    },
  },
  {
    timestamps: true, // لإضافة createdAt و updatedAt تلقائيًا
  },
);

const Client = model<IClient>('Client', clientSchema);
export default Client;