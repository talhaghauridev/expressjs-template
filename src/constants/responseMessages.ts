const AUTH_MESSAGES = {
  // Registration
  REGISTRATION_SUCCESS: 'User registered successfully',
  REGISTRATION_FAILED: 'Failed to register user',
  USER_ALREADY_EXISTS: 'User already exists',
  USERNAME_ALREADY_EXISTS: 'Username already exists',

  INVALID_REGISTRATION_DATA: 'Please provide all required fields for registration',
  OTP_SEND_MESSAGE: 'Account not verified. A new verification code has been sent to your email.',
  INVALID_OTP: 'Invalid OTP',
  VERIFICATION_SUCCESS: 'Your Verification successfully',
  VERIFICATION_FAILED: 'Verification Failed',
  ALREADY_VERIFIED: 'Account is already verified',
  RESEND_VERIFICATION_SUCCESS: 'A new verification code has been sent to your email',
  // Login
  LOGIN_SUCCESS: 'User logged in successfully',
  LOGIN_FAILED: 'Login failed',
  INVALID_CREDENTIALS: 'Invalid Credentials',
  INVALID_LOGIN_DATA: 'Please provide email and password',

  // OAuth
  GOOGLE_AUTH_INITIATED: 'Google authentication initiated',
  GOOGLE_AUTH_FAILED: 'Google authentication failed',
  FACEBOOK_AUTH_INITIATED: 'Facebook authentication initiated',
  FACEBOOK_AUTH_FAILED: 'Facebook authentication failed',
  OAUTH_CALLBACK_ERROR: 'OAuth callback error',

  // Logout
  LOGOUT_SUCCESS: 'User logged out successfully',

  // Token
  TOKEN_EXPIRED: 'Authentication token has expired',
  TOKEN_INVALID: 'Invalid authentication token',
  TOKEN_REQUIRED: 'Authentication token is required',

  // Password
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_RESET_FAILED: 'Password reset failed',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
  PASSWORD_CHANGE_FAILED: 'Failed to change password',
};

// User Response Messages
const USER_MESSAGES = {
  USER_FOUND: 'User found',
  USER_NOT_FOUND: 'User not found',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_PROFILE_UPDATED: 'User profile updated successfully',
  INVALID_USER_DATA: 'Invalid user data provided',
};

// Validation Response Messages
const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters long',
  INVALID_PLATFORM: 'Platform must be one of: web, mobile, desktop',
  INVALID_REDIRECT_URL: 'Invalid redirect URL',
  INVALID_STATE: 'Invalid authentication state',
  STATE_EXPIRED: 'Authentication state expired',
  PLATFORM_MISMATCH: 'Platform mismatch',
};

// Error Response Messages
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

// Success Response Messages
const SUCCESS_MESSAGES = {
  OPERATION_SUCCESS: 'Operation completed successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
  DATA_CREATED: 'Data created successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully',
};

export const ResponseMessages = {
  AUTH: AUTH_MESSAGES,
  USER: USER_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
} as const;
