import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User.schema';
import { IClient } from './Client.schema';

// تعريف الحالات المحتملة للقضية
export enum CaseStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
}

// واجهة لتعريف حقول القضية في TypeScript
export interface ICase extends Document {
  title: string;
  description: string;
  status: CaseStatus;
  ownerId: Types.ObjectId | IUser;
  clientId: Types.ObjectId | IClient;
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<ICase>(
  {
    title: {
      type: String,
      required: [true, 'Case title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Case description is required'],
    },
    status: {
      type: String,
      enum: Object.values(CaseStatus), // يجب أن تكون القيمة واحدة من قيم CaseStatus
      default: CaseStatus.OPEN,
    },
    // ربط القضية بالمستخدم (المالك)
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ربط القضية بالعميل
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
  },
  {
    timestamps: true, // لإضافة createdAt و updatedAt تلقائيًا
  },
);

const Case = model<ICase>('Case', caseSchema);
export default Case;