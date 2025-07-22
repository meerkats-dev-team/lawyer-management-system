import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// واجهة لتعريف حقول المستخدم في TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // كلمة المرور اختيارية لأن المستخدم قد يسجل عبر وسائل التواصل الاجتماعي
  avatarUrl?: string;
  socialId?: {
    google?: string;
    facebook?: string;
  };
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // كلمة المرور مطلوبة فقط إذا لم يكن هناك تسجيل اجتماعي
        return !this.socialId || Object.keys(this.socialId).length === 0;
      },
      minlength: 6,
      select: false, // لا تقم بإرجاع كلمة المرور في الاستعلامات افتراضيًا
    },
    avatarUrl: {
      type: String,
      default: 'https://i.pravatar.cc/150', // صورة افتراضية
    },
    socialId: {
      google: { type: String, unique: true, sparse: true },
      facebook: { type: String, unique: true, sparse: true },
    },
  },
  {
    timestamps: true, // لإضافة createdAt و updatedAt تلقائيًا
  },
);

// Middleware (Hook) لتجزئة كلمة المرور قبل حفظها
userSchema.pre<IUser>('save', async function (next) {
  // قم بتجزئة كلمة المرور فقط إذا تم تعديلها (أو كانت جديدة)
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// دالة لمقارنة كلمة المرور المدخلة بالكلمة المجزأة في قاعدة البيانات
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};


const User = model<IUser>('User', userSchema);
export default User;