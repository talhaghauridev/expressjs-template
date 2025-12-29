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
  oauthSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyResetPasswordOTPSchema,
  resetPasswordOTPSchema,
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

router.post(
  '/verify-reset-otp',
  validate(verifyResetPasswordOTPSchema),
  authController.verifyResetPasswordOTP
);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post(
  '/reset-password-otp',
  validate(resetPasswordOTPSchema),
  authController.resetPasswordOTP
);

router.post('/refresh-token', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', authenticate, validate(logoutSchema), authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);

router.get('/google/url', validate(oauthSchema), authController.googleAuthUrl);
router.get('/google', validate(oauthSchema), authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

router.get('/facebook/url', validate(oauthSchema), authController.facebookAuthUrl);
router.get('/facebook', validate(oauthSchema), authController.facebookAuth);
router.get('/facebook/callback', authController.facebookCallback);

export default router;
