import { Router } from 'express';
import * as authController from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  verifyEmailOTPSchema,
  resendVerificationSchema,
  refreshTokenSchema,
  logoutSchema,
} from '@/validators/auth.validator';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/verify-otp', validate(verifyEmailOTPSchema), authController.verifyEmailOTP);
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  authController.verifyEmailOTP
);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', authenticate, validate(logoutSchema), authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);

export default router;
