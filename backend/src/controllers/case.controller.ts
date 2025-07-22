import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Case from '../models/Case.schema';
import Client from '../models/Client.schema'; // نحتاجه للتحقق من ملكية العميل

// @desc    Create a new case
// @route   POST /api/v1/cases
// @access  Private
export const createCase = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, status, clientId } = req.body;
  const ownerId = req.user!._id; // `req.user` مضمون وجوده بفضل middleware الحماية

  try {
    // 1. التحقق من أن العميل (clientId) ينتمي للمستخدم الحالي
    const client = await Client.findOne({ _id: clientId, ownerId });
    if (!client) {
       res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'The specified client does not belong to the current user.',
      });
      return
    }

    // 2. إنشاء القضية
    const newCase = await Case.create({ title, description, status, clientId, ownerId });
    res.status(StatusCodes.CREATED).json({ success: true, data: newCase });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all cases for the logged-in user
// @route   GET /api/v1/cases
// @access  Private
export const getCases = async (req: Request, res: Response, next: NextFunction) => {
  const ownerId = req.user!._id;
  const { clientId } = req.query; // للسماح بالفلترة حسب العميل

  const query: { ownerId: any; clientId?: any } = { ownerId };
  if (clientId) {
    query.clientId = clientId;
  }

  try {
    const cases = await Case.find(query).populate('clientId', 'name').sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single case by ID
// @route   GET /api/v1/cases/:id
// @access  Private
export const getCaseById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ownerId = req.user!._id;

  try {
    const singleCase = await Case.findOne({ _id: id, ownerId }).populate('clientId', 'name contactInfo');

    if (!singleCase) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Case not found with id of ${id}` });
    return
    }
    res.status(StatusCodes.OK).json({ success: true, data: singleCase });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a case
// @route   PATCH /api/v1/cases/:id
// @access  Private
export const updateCase = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ownerId = req.user!._id;

  try {
    const singleCase = await Case.findOne({ _id: id, ownerId });

    if (!singleCase) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Case not found with id of ${id}` });
    return
    }

    const updatedCase = await Case.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.status(StatusCodes.OK).json({ success: true, data: updatedCase });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a case
// @route   DELETE /api/v1/cases/:id
// @access  Private
export const deleteCase = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ownerId = req.user!._id;

  try {
    const singleCase = await Case.findOne({ _id: id, ownerId });

    if (!singleCase) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Case not found with id of ${id}` });
    return
    }

    await singleCase.deleteOne();
    // TODO: لاحقاً، يجب حذف المواعيد والملفات المرتبطة بهذه القضية
    res.status(StatusCodes.OK).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};