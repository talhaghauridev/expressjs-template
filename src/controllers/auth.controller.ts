import { AuthService } from '@/services/auth.service';
import ApiResponse from '@/utils/api-response';
import asyncHandler from '@/utils/async-handler';
import { getDeviceInfo } from '@/utils/get-device-info';
import { Request, Response } from 'express';
import requestIp from 'request-ip';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const deviceInfo = getDeviceInfo(req);
  const { message } = await AuthService.register(name, email, password, deviceInfo);
  return ApiResponse.created(res, {}, message);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const clientIp = requestIp.getClientIp(req);
  const deviceInfo = getDeviceInfo(req);

  const { accessToken, refreshToken, user } = await AuthService.login(
    email,
    password,
    deviceInfo,
    clientIp!
  );

  return ApiResponse.success(res, { accessToken, refreshToken, user }, 'Login successfully');
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };
  const clientIp = requestIp.getClientIp(req);
  const deviceInfo = getDeviceInfo(req);

  const { accessToken, refreshToken, user } = await AuthService.verifyEmail(
    token,
    deviceInfo,
    clientIp!
  );

  return ApiResponse.success(
    res,
    { accessToken, refreshToken, user },
    'Email verified successfully'
  );
});

export const verifyEmailOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const clientIp = requestIp.getClientIp(req);
  const deviceInfo = getDeviceInfo(req);

  const { accessToken, refreshToken, user } = await AuthService.verifyEmailOTP(
    email,
    otp,
    deviceInfo,
    clientIp!
  );

  return ApiResponse.success(
    res,
    { accessToken, refreshToken, user },
    'Email verified successfully'
  );
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const deviceInfo = getDeviceInfo(req);

  const { message } = await AuthService.resendVerification(email, deviceInfo.platform);

  return ApiResponse.success(res, {}, message);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);

  return ApiResponse.success(
    res,
    { accessToken, refreshToken: newRefreshToken },
    'Token refreshed successfully'
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const { message } = await AuthService.logout(refreshToken);

  return ApiResponse.success(res, null, message);
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id!;

  const { message } = await AuthService.logoutAll(userId);

  return ApiResponse.success(res, null, message);
});
