import { ExpiryTime } from '@/constants/expiry';
import { User } from '@/database/schema';
import { env } from '@/env';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

type TokenPayload = Pick<User, 'id' | 'name' | 'email' | 'role' | 'provider'>;

export class TokenService {
  static generateAccessToken(payload: TokenPayload) {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: ExpiryTime.ACCESS_TOKEN as SignOptions['expiresIn'],
    });
  }

  static generateAccessAndRefreshToken(payload: TokenPayload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();
    return { accessToken, refreshToken };
  }

  static generateRefreshToken() {
    return crypto.randomUUID();
  }

  static verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static decodeToken(token: string) {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}
