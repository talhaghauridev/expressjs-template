// services/auth.service.ts
import { AuthProviderType, LocationType } from '@/constants/auth';
import { ExpiryTime } from '@/constants/expiry';
import { SessionRepository } from '@/repositories/sessions.repository';
import { UserLocationRepository } from '@/repositories/user-locations.repository';
import { UserRepository } from '@/repositories/users.repository';
import ApiError from '@/utils/api-error';
import { DeviceInfo, formatDeviceInfo } from '@/utils/get-device-info';
import { getLocationFromIp } from '@/utils/get-location';
import { parseTimeToMs } from '@/utils/parse-time';
import { comparePassword, hashPassword } from '@/utils/password';
import { TokenService } from './token.service';
import { VerificationService } from './verifications.service';

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
    deviceInfo: DeviceInfo,
    clientIp: string
  ) {
    const existingUser = await UserRepository.findByEmail(email, { email: true });

    if (existingUser && existingUser.isVerified === true) {
      throw ApiError.conflict('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await UserRepository.create(
      {
        email,
        password: hashedPassword,
        name,
        provider: AuthProviderType.CUSTOM,
        isVerified: false,
      },
      { password: false }
    );

    const location = await getLocationFromIp(clientIp);

    await VerificationService.sendVerification(user.id, user.email, deviceInfo.platform);

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
      user,
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

    const session = await SessionRepository.create({
      userId: user.id,
      refreshToken,
      deviceInfo: formatDeviceInfo(deviceInfo),
      expiresAt: new Date(Date.now() + parseTimeToMs(ExpiryTime.REFRESH_TOKEN)),
    });

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
      {
        userId: true,
      }
    );

    return {
      accessToken,
      refreshToken: session.refreshToken,
      user: this.excludePassword(user),
    };
  }

  public static excludePassword<T extends { password?: string }>(
    user: T | null
  ): Omit<T, 'password'> | null {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
