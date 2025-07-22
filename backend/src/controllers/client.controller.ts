import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Client from '../models/Client.schema';

// @desc    Create a new client
// @route   POST /api/v1/clients
// @access  Private
export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  const { name, contactInfo } = req.body;
  const ownerId = req.user?._id; // نحصل عليه من middleware الحماية

  try {
    const client = await Client.create({ name, contactInfo, ownerId });
    res.status(StatusCodes.CREATED).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clients for the logged-in user
// @route   GET /api/v1/clients
// @access  Private
export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  const ownerId = req.user?._id;

  try {
    const clients = await Client.find({ ownerId }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single client by ID
// @route   GET /api/v1/clients/:id
// @access  Private
export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ownerId = req.user?._id;

  try {
    const client = await Client.findOne({ _id: id, ownerId });

    if (!client) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Client not found with id of ${id}` });
       return
    }
    res.status(StatusCodes.OK).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a client
// @route   PATCH /api/v1/clients/:id
// @access  Private
export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ownerId = req.user?._id;

  try {
    let client = await Client.findOne({ _id: id, ownerId });

    if (!client) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Client not found with id of ${id}` });
       return
    }

    client = await Client.findByIdAndUpdate(id, req.body, {
      new: true, // إرجاع النسخة المحدثة
      runValidators: true,
    });

    res.status(StatusCodes.OK).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a client
// @route   DELETE /api/v1/clients/:id
// @access  Private
export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ownerId = req.user?._id;

  try {
    const client = await Client.findOne({ _id: id, ownerId });

    if (!client) {
       res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `Client not found with id of ${id}` });
       return
    }

    await client.deleteOne(); // استخدم deleteOne بدلاً من remove (الذي أصبح deprecated)

    // TODO: لاحقاً، يجب التعامل مع ما سيحدث للقضايا المرتبطة بهذا العميل.    

    res.status(StatusCodes.OK).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};