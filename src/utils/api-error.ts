import { ApiMessages } from '@/constants/api-messages';
import { HTTP_STATUS } from './http-status';

class ApiError extends Error {
  success = false;
  statusCode: number;
  message: string;

  constructor(
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: string = ApiMessages.ERROR.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = ApiMessages.ERROR.BAD_REQUEST) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  static unauthorized(message: string = ApiMessages.ERROR.UNAUTHORIZED) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = ApiMessages.ERROR.FORBIDDEN) {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = ApiMessages.ERROR.NOT_FOUND) {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string = ApiMessages.ERROR.CONFLICT) {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = ApiMessages.ERROR.INTERNAL_SERVER_ERROR) {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }

  static custom(statusCode: number, message: string) {
    return new ApiError(statusCode, message);
  }
}

export default ApiError;
