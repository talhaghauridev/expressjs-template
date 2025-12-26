const COMMON_MESSAGES = {
  USER_ALREADY_EXISTS: 'User already exists',
  ALREADY_VERIFIED: 'Account is already verified',
  INVALID_CREDENTIALS: 'Invalid Credentials',

  TOKEN_EXPIRED: 'Authentication token has expired',
  TOKEN_INVALID: 'Invalid authentication token',
  TOKEN_REQUIRED: 'Authentication token is required',
  USER_NOT_FOUND: 'User not found',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timeout',
};

const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Invalid email format',
  INVALID_DATE: 'Invalid date format',
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters long`,
  MAX_LENGTH: (field: string, max: number) => `${field} must be at most ${max} characters long`,
  INVALID_FORMAT: (field: string) => `Invalid ${field} format`,

  MUST_BE_STRING: (field: string) => `${field} must be a string`,
  MUST_BE_NUMBER: (field: string) => `${field} must be a number`,
  MUST_BE_BOOLEAN: (field: string) => `${field} must be a boolean`,
  MUST_BE_OBJECT: (field: string) => `${field} must be an object`,
  MUST_BE_ARRAY: (field: string) => `${field} must be an array`,

  MUST_BE_DATE: (field: string) => `${field} must be a valid date`,
  VALUE_TOO_SMALL: (field: string, min: number) => `${field} must be at least ${min}`,
  VALUE_TOO_LARGE: (field: string, max: number) => `${field} must be at most ${max}`,
};

const ERROR_MESSAGES = {
  DATABASE_ERROR: 'Database error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  VALIDATION_ERROR: 'Validation error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  METHOD_NOT_ALLOWED: 'Method not allowed',
  CONFLICT: 'Resource conflict',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  TOO_MANY_REQUESTS: 'Too many requests',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
};

const SUCCESS_MESSAGES = {
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  RETRIEVED: 'Retrieved successfully',
};

export const ApiMessages = {
  VALIDATION: VALIDATION_MESSAGES,
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
  ...COMMON_MESSAGES,
} as const;
