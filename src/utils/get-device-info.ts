import { AvailablePlatforms, PlatformType } from '@/constants/auth';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

export interface DeviceInfo {
  platform: (typeof AvailablePlatforms)[number];
  device: string | null;
  browser: string | null;
}

export const getDeviceInfo = (req: Request): DeviceInfo => {
  const deviceType = req.headers['x-device-type'] as string | undefined;
  const deviceLower = deviceType?.toLowerCase().trim();

  if (deviceLower === 'android' || deviceLower === 'ios') {
    return {
      platform: PlatformType.MOBILE,
      device: deviceLower,
      browser: null,
    };
  }

  const ua = parser.setUA(req.headers['user-agent'] || '').getResult();
  console.log({ ua });
  return {
    platform: PlatformType.WEB,
    device: ua.os.name?.toLowerCase() || null,
    browser: ua.browser.name || null,
  };
};

export const formatDeviceInfo = (deviceInfo: DeviceInfo): string | null => {
  if (deviceInfo.platform === PlatformType.MOBILE) {
    return deviceInfo.device;
  }

  if (!deviceInfo.browser || !deviceInfo.device) {
    return null;
  }

  return `${deviceInfo.browser} on ${deviceInfo.device}`;
};
