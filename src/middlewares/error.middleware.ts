import { NextFunction, Request, Response } from 'express';
import { PostgresError } from 'postgres';
import { env } from '@/env';
import ApiError from '@/utils/api-error';
import handlePostgresError from '@/utils/handle-postgres-error';

const errorMiddleware = (
  err: Error | ApiError | PostgresError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  console.log('Error :', err);

  if ('code' in err && typeof err.code === 'string') {
    error = handlePostgresError(err as PostgresError);
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, error.message || 'Internal Server Error');
  }

  const apiError = error as ApiError;

  res.status(apiError.statusCode).json({
    success: false,
    statusCode: apiError.statusCode,
    message: apiError.message,
    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
