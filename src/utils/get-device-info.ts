import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

const parser = new UAParser();

export interface DeviceInfo {
  platform: 'web' | 'mobile';
  device: string | null;
  browser: string | null;
}

export const getDeviceInfo = (req: Request): DeviceInfo => {
  const deviceType = req.headers['x-device-type'] as string | undefined;
  const deviceLower = deviceType?.toLowerCase().trim();

  if (deviceLower === 'android' || deviceLower === 'ios') {
    return {
      platform: 'mobile',
      device: deviceLower,
      browser: null,
    };
  }

  const ua = parser.setUA(req.headers['user-agent'] || '').getResult();

  return {
    platform: 'web',
    device: ua.os.name?.toLowerCase() || null,
    browser: ua.browser.name || null,
  };
};
