import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';
import User, { IUser } from '../models/User.schema';
import { StatusCodes } from 'http-status-codes';

// إضافة خاصية user إلى واجهة Request في Express
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  //Bearer kljdflkgjdlkjgoihjtrhlnlfnkhtlnkfl

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // الحصول على التوكن من الهيدر
      token = req.headers.authorization.split(' ')[1];

      // التحقق من صحة التوكن
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // إيجاد المستخدم وإضافته إلى الطلب (بدون كلمة المرور)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
           res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
           return
      }

      next();
    } catch (error) {
      console.error(error);
       res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, token failed' });
       return
    }
  }

  if (!token) {
     res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized, no token' });
     return
  }
};