import { AuthProviderType, AvailablePlatforms, LocationType, PlatformType } from '@/constants/auth';
import { ExpiryTime } from '@/constants/expiry';
import { SessionRepository } from '@/repositories/sessions.repository';
import { UserLocationRepository } from '@/repositories/user-locations.repository';
import { UserRepository } from '@/repositories/users.repository';
import { VerificationRepository } from '@/repositories/verifications.repository';
import ApiError from '@/utils/api-error';
import { DeviceInfo, formatDeviceInfo } from '@/utils/get-device-info';
import { getLocationFromIp } from '@/utils/get-location';
import { parseTimeToMs } from '@/utils/parse-time';
import { comparePassword, hashPassword } from '@/utils/password';
import { TokenService } from './token.service';
import { VerificationService } from './verifications.service';

export class AuthService {
  static async register(name: string, email: string, password: string, deviceInfo: DeviceInfo) {
    const existingUser = await UserRepository.findByEmail(email, {
      id: true,
      isVerified: true,
    });

    if (existingUser?.isVerified === true) {
      throw ApiError.conflict('Email already registered');
    }

    const hashedPassword = await hashPassword(password);

    let user;

    if (existingUser && !existingUser.isVerified) {
      user = await UserRepository.update(
        existingUser.id,
        {
          name,
          password: hashedPassword,
          createdAt: new Date(),
          isVerified: false,
        },
        { password: false }
      );
    } else {
      user = await UserRepository.create(
        {
          email,
          password: hashedPassword,
          name,
          provider: AuthProviderType.CUSTOM,
          isVerified: false,
        },
        { password: false }
      );
    }

    await VerificationService.sendVerification(user.id, user.email, deviceInfo.platform);

    return {
      user,
      message:
        deviceInfo.platform === PlatformType.WEB
          ? `Verification link sent to ${user.email}`
          : `Verification code sent to ${user.email}`,
    };
  }

  static async login(email: string, password: string, deviceInfo: DeviceInfo, clientIp: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user || user.provider !== AuthProviderType.CUSTOM || user.isVerified === false) {
      throw ApiError.badRequest('Invalid credentials');
    }

    const isPasswordMatch = await comparePassword(password, user.password!);

    if (!isPasswordMatch) {
      throw ApiError.badRequest('Invalid credentials');
    }

    const { accessToken, refreshToken } = TokenService.generateAccessAndRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    });

    const location = await getLocationFromIp(clientIp);

    const session = await SessionRepository.create(
      {
        userId: user.id,
        refreshToken,
        deviceInfo: formatDeviceInfo(deviceInfo),
        expiresAt: new Date(Date.now() + parseTimeToMs(ExpiryTime.REFRESH_TOKEN)),
      },
      { refreshToken: true }
    );

    await UserLocationRepository.upsertLastLogin(
      user.id,
      {
        country: location.country,
        city: location.city,
        ip: clientIp,
        platform: deviceInfo.platform,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
      },
      { userId: true }
    );

    return {
      accessToken,
      refreshToken: session.refreshToken,
      user: this.excludePassword(user),
    };
  }

  static async verifyEmail(token: string, deviceInfo: DeviceInfo, clientIp: string) {
    const verification = await VerificationRepository.findByToken(token);

    if (!verification) {
      throw ApiError.badRequest('This verification link is invalid or has already been used');
    }

    if (verification.expiresAt < new Date()) {
      await VerificationRepository.deleteByToken(token);
      throw ApiError.badRequest('This verification link has expired. Please request a new one');
    }

    if (verification.platform !== PlatformType.WEB) {
      throw ApiError.badRequest('Please use the verification link sent to your email');
    }

    const user = await UserRepository.update(
      verification.userId,
      { isVerified: true },
      { password: false }
    );
    await VerificationRepository.deleteByToken(token);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const { accessToken, refreshToken } = TokenService.generateAccessAndRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    });

    const location = await getLocationFromIp(clientIp);

    const session = await SessionRepository.create(
      {
        userId: user.id,
        refreshToken,
        deviceInfo: formatDeviceInfo(deviceInfo),
        expiresAt: new Date(Date.now() + parseTimeToMs(ExpiryTime.REFRESH_TOKEN)),
      },
      { refreshToken: true }
    );

    await UserLocationRepository.create(
      {
        userId: user.id,
        type: LocationType.REGISTRATION,
        country: location.country,
        city: location.city,
        ip: clientIp,
        platform: deviceInfo.platform,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
      },
      { userId: true }
    );
    return {
      accessToken,
      refreshToken: session.refreshToken,
      user,
    };
  }

  static async verifyEmailOTP(
    email: string,
    otp: string,
    deviceInfo: DeviceInfo,
    clientIp: string
  ) {
    const verification = await VerificationRepository.findByToken(otp);

    if (!verification) {
      throw ApiError.badRequest('Invalid verification code');
    }

    const isUser = await UserRepository.findById(verification.userId, { email: true });

    if (!isUser || isUser.email !== email) {
      throw ApiError.badRequest('Invalid verification code');
    }

    if (verification.expiresAt < new Date()) {
      await VerificationRepository.deleteByToken(otp);
      throw ApiError.badRequest('This verification code has expired. Please request a new one');
    }

    if (verification.platform !== PlatformType.MOBILE) {
      throw ApiError.badRequest('Please use the verification code sent to your email');
    }

    const user = await UserRepository.update(
      verification.userId,
      { isVerified: true },
      { password: false }
    );

    await VerificationRepository.deleteByToken(otp);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const { accessToken, refreshToken } = TokenService.generateAccessAndRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    });

    const location = await getLocationFromIp(clientIp);

    const session = await SessionRepository.create(
      {
        userId: user.id,
        refreshToken,
        deviceInfo: formatDeviceInfo(deviceInfo),
        expiresAt: new Date(Date.now() + parseTimeToMs(ExpiryTime.REFRESH_TOKEN)),
      },
      { refreshToken: true }
    );

    await UserLocationRepository.create(
      {
        userId: user.id,
        type: LocationType.REGISTRATION,
        country: location.country,
        city: location.city,
        ip: clientIp,
        platform: deviceInfo.platform,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
      },
      { userId: true }
    );

    return {
      accessToken,
      refreshToken: session.refreshToken,
      user,
    };
  }

  static async resendVerification(email: string, platform: (typeof AvailablePlatforms)[number]) {
    const user = await UserRepository.findByEmail(email, { id: true, isVerified: true });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.isVerified) {
      throw ApiError.badRequest('Email already verified.');
    }

    await VerificationService.sendVerification(user.id, email, platform);

    return {
      message: platform === PlatformType.WEB ? 'Verification link sent' : 'Verification code sent',
    };
  }

  static async refresh(refreshToken: string) {
    const session = await SessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    if (session.expiresAt < new Date()) {
      await SessionRepository.deleteById(session.id);
      throw ApiError.unauthorized('Session expired');
    }

    const user = await UserRepository.findById(session.userId, { password: false });

    if (!user) {
      await SessionRepository.deleteById(session.id);
      throw ApiError.unauthorized('User not found');
    }

    const newAccessToken = TokenService.generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
    });

    const newRefreshToken = TokenService.generateRefreshToken();

    const updatedSession = await SessionRepository.update(
      session.id,
      {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + parseTimeToMs(ExpiryTime.REFRESH_TOKEN)),
      },
      { refreshToken: true }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: updatedSession.refreshToken,
    };
  }

  static async logout(refreshToken: string) {
    const session = await SessionRepository.findByRefreshToken(refreshToken, { id: true });

    if (!session) {
      return { message: 'Logged out successfully' };
    }

    await SessionRepository.deleteById(session.id);

    return { message: 'Logged out successfully' };
  }

  static async logoutAll(userId: string) {
    await SessionRepository.deleteAllByUserId(userId);

    return { message: 'Logged out from all devices' };
  }

  public static excludePassword<T extends { password?: string }>(
    user: T | null
  ): Omit<T, 'password'> | null {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
