import { PlatformType } from '@/constants/auth';
import { AuthService } from '@/services/auth.service';
import ApiResponse from '@/utils/api-response';
import asyncHandler from '@/utils/async-handler';
import { getDeviceInfo } from '@/utils/get-device-info';
import { Request, Response } from 'express';
import requestIp from 'request-ip';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const clientIp = requestIp.getClientIp(req);
  const deviceInfo = getDeviceInfo(req);

  const { user } = await AuthService.register(email, password, name, deviceInfo, clientIp!);

  const message =
    deviceInfo.platform === PlatformType.WEB
      ? `Verification link sent to your email ${user.email}`
      : `Verification code sent to your email ${user.email}`;

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

  return ApiResponse.success(res, { accessToken, refreshToken, user }, 'Login successful');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {});

export const logout = asyncHandler(async (req: Request, res: Response) => {});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {});
