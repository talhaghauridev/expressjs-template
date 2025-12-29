import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import ApiError from '@/utils/api-error';

interface ValidationSchema {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
  headers?: ZodObject;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        schema.query.parse(req.query);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params) as any;
      }

      if (schema.headers) {
        req.headers = schema.headers.parse(req.headers) as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((err) => err.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
      }

      next(error);
    }
  };
};
