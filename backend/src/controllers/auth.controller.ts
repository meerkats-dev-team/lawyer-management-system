import { Request, Response, NextFunction } from 'express';
import User from '../models/User.schema';
import { config } from '../config/config';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes'; // مكتبة مساعدة (اختيارية لكنها مفيدة)

// قم بتثبيت http-status-codes: npm install http-status-codes

// دالة لتوليد JWT
const generateToken = (id: string): string => {
    // @ts-ignore
  return jwt.sign(
    { id },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn, // مدة صلاحية التوكن
    });
};

// متحكم التسجيل
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
       res.status(StatusCodes.CONFLICT).json({ message: 'User with this email already exists' });
       return
    }

    const user = await User.create({ name, email, password });
   
    const token: string = generateToken(user._id!.toString());

    res.status(StatusCodes.CREATED).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// متحكم تسجيل الدخول
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
       res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
       return
    }

    const token: string = generateToken(user._id!.toString());

    res.status(StatusCodes.OK).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// متحكمات تسجيل الدخول الاجتماعي (سيتم تنفيذها لاحقاً)
export const googleLogin = (req: Request, res: Response) => {
    // منطق Passport.js سيأتي هنا
    res.send("Redirecting to Google...");
};

export const googleCallback = (req: Request, res: Response) => {
    // منطق Passport.js لتوليد التوكن بعد المصادقة
    res.send("Google callback received");
};