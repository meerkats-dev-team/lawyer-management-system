import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { StatusCodes } from 'http-status-codes';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e: any) {
     res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Validation error',
      errors: e.errors,
    });
    return
  }
};

export default validate;