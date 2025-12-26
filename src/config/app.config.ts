import { env } from '@/env';
import compression, { CompressionOptions } from 'compression';
import { CorsOptions } from 'cors';
import { HelmetOptions } from 'helmet';

const getAllowedOrigins = (): string[] => {
  return env.CORS_ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

const cors: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = getAllowedOrigins();

    if (env.isDev) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

const helemt: HelmetOptions = {
  contentSecurityPolicy: env.isDev,
  crossOriginEmbedderPolicy: env.isDev,
};

const _compression: CompressionOptions = {
  level: 6,
  threshold: '2kb',
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
};
export const config = {
  cors,
  helemt,
  compression: _compression,
};
