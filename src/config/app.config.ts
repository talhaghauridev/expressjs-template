import { env } from '@/env';
import compression, { CompressionOptions } from 'compression';
import { CorsOptions } from 'cors';
import { HelmetOptions } from 'helmet';

const cors: CorsOptions = { origin: ' * ', credentials: true };

const helemt: HelmetOptions = {
  contentSecurityPolicy: env.NODE_ENV !== 'development',
  crossOriginEmbedderPolicy: env.NODE_ENV !== 'development',
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
