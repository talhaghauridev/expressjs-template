import geoip from 'fast-geoip';
import logger from './logger';

export interface LocationInfo {
  ip: string;
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const getLocationFromIp = async (ip: string): Promise<LocationInfo> => {
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
    return {
      ip,
      country: 'Local',
      region: 'Local',
      city: 'Local',
      timezone: null,
      latitude: null,
      longitude: null,
    };
  }

  try {
    const geo = await geoip.lookup(ip);
    logger.info(`Geolocation for IP ${ip}: ${JSON.stringify(geo)}`);
    if (!geo) {
      return {
        ip,
        country: null,
        region: null,
        city: null,
        timezone: null,
        latitude: null,
        longitude: null,
      };
    }

    return {
      ip,
      country: geo.country || null,
      region: geo.region || null,
      city: geo.city || null,
      timezone: geo.timezone || null,
      latitude: geo.ll?.[0] || null,
      longitude: geo.ll?.[1] || null,
    };
  } catch (error) {
    console.error('Geolocation failed:', error);
    return {
      ip,
      country: null,
      region: null,
      city: null,
      timezone: null,
      latitude: null,
      longitude: null,
    };
  }
};
