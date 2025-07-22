import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Case from '../models/Case.schema';
import Appointment from '../models/Appointment.schema';

/**
 * Middleware للتحقق من أن المستخدم المسجل هو مالك القضية.
 * يبحث عن `caseId` في `req.params`.
 * إذا لم يجده، يبحث عن `id` (لموعد أو ملف)، يجد العنصر، ثم يستخرج `caseId` منه للتحقق.
 * هذا يجعله مرنًا للاستخدام في مسارات القضايا المباشرة والمسارات المتداخلة (مواعيد، ملفات).
 */
export const checkCaseOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const ownerId = req.user!._id as string; // تأكد من أن المستخدم مسجل الدخول ولديه _id
  let caseIdToVerify: string | undefined = req.params.caseId;

  try {
    // إذا لم يكن caseId موجودًا في المسار (مثل مسارات /appointments/:id)
    if (!caseIdToVerify) {
      const resourceId = req.params.id; // قد يكون appointmentId أو fileId
      if (resourceId) {
        // محاولة العثور عليه كموعد أولاً
        const appointment = await Appointment.findById(resourceId);
        if (appointment) {
          caseIdToVerify = appointment.caseId.toString();
        } 
        // TODO: لاحقاً، يمكن إضافة البحث في نماذج أخرى مثل الملفات (Files) هنا
      }
    }
    
    // إذا لم يتم العثور على `caseId` بعد كل المحاولات
    if (!caseIdToVerify) {
       res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: 'Case ID is missing or could not be determined from the request.' 
      });
      return
    }

    const caseRecord = await Case.findById(caseIdToVerify);

    if (!caseRecord) {
       res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: `Case with ID ${caseIdToVerify} not found.` 
      });
      return
    }

    // التحقق من تطابق هوية المستخدم مع هوية مالك القضية
    if (caseRecord.ownerId.toString() !== ownerId.toString()) {
       res.status(StatusCodes.FORBIDDEN).json({ 
        success: false, 
        message: 'You are not authorized to access resources for this case.' 
      });
      return
    }

    // إذا تم التحقق من الملكية، انتقل إلى الـ Middleware أو المتحكم التالي
    next();

  } catch (error) {
    next(error);
  }
};