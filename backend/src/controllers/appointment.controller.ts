import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Appointment from '../models/Appointment.schema';

// @desc    إنشاء موعد جديد لقضية محددة
// @route   POST /api/v1/cases/:caseId/appointments
export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { caseId } = req.params;
  try {
    const appointment = await Appointment.create({ ...req.body, caseId });
    res.status(StatusCodes.CREATED).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب كل المواعيد لقضية محددة
// @route   GET /api/v1/cases/:caseId/appointments
export const getAppointmentsForCase = async (req: Request, res: Response, next: NextFunction) => {
  const { caseId } = req.params;
  try {
    const appointments = await Appointment.find({ caseId }).sort({ time: 'asc' });
    res.status(StatusCodes.OK).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    جلب موعد واحد محدد بالـ ID
// @route   GET /api/v1/cases/:caseId/appointments/:appointmentId
export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  const { caseId, appointmentId } = req.params;
  try {
    const appointment = await Appointment.findOne({ _id: appointmentId, caseId: caseId });
    if (!appointment) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Appointment not found in this case.` });
    return
      }
    res.status(StatusCodes.OK).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    تحديث موعد محدد
// @route   PATCH /api/v1/cases/:caseId/appointments/:appointmentId
export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { caseId, appointmentId } = req.params;
  try {
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, caseId: caseId }, // الشرط: يجب أن يتطابق ID الموعد و ID القضية
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAppointment) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Appointment not found in this case.` });
    return
      }
    res.status(StatusCodes.OK).json({ success: true, data: updatedAppointment });
  } catch (error) {
    next(error);
  }
};

// @desc    حذف موعد محدد
// @route   DELETE /api/v1/cases/:caseId/appointments/:appointmentId
export const deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { caseId, appointmentId } = req.params;
  try {
    const result = await Appointment.deleteOne({ _id: appointmentId, caseId: caseId });
    if (result.deletedCount === 0) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Appointment not found in this case.` });
    return
      }
    res.status(StatusCodes.OK).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};