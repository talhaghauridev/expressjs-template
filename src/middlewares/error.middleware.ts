import { NextFunction, Request, Response } from 'express';
import { ApiMessages } from '@/constants/api-messages';
import { env } from '@/env';
import ApiError from '@/utils/api-error';
import handlePostgresError from '@/utils/handle-postgres-error';
import logger from '@/utils/logger';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  let error: ApiError;

  if (err.cause?.code && typeof err.cause.code === 'string') {
    error = handlePostgresError(err.cause);
  } else if (err.code && typeof err.code === 'string' && !err.statusCode) {
    error = handlePostgresError(err);
  } else if (err instanceof ApiError) {
    error = err;
  } else {
    error = ApiError.internal(err.message || ApiMessages.ERROR.INTERNAL_SERVER_ERROR);
  }
  if (env.isDev) {
    logger.error(error.message);
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
