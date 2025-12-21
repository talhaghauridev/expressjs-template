import { HTTP_STATUS } from './http-status';
import { ResponseMessages } from '@/constants/response-messages';

class ApiError extends Error {
  success = false;
  statusCode: number;
  message: string;

  constructor(
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: string = ResponseMessages.ERROR.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = ResponseMessages.ERROR.BAD_REQUEST) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  static unauthorized(message: string = ResponseMessages.ERROR.UNAUTHORIZED) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = ResponseMessages.ERROR.FORBIDDEN) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = ResponseMessages.ERROR.NOT_FOUND) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string = ResponseMessages.ERROR.CONFLICT) {
    throw new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = ResponseMessages.ERROR.INTERNAL_SERVER_ERROR) {
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }

  static custom(statusCode: number, message: string) {
    throw new ApiError(statusCode, message);
  }
}

export default ApiError;
