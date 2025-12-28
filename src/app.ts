import { config } from '@/config/app.config';
import { db } from '@/database/db';
import { users } from '@/database/schema';
import errorMiddleware from '@/middlewares/error.middleware';
import morganMiddleware from '@/middlewares/morgan.middleware';
import routes from '@/routes';
import { getLocationFromIp } from '@/utils/get-location';
import logger from '@/utils/logger';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import requestIp from 'request-ip';

const app = express();
app.set('trust proxy', true);
app.use(helmet(config.helemt));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression(config.compression));
app.use(cors(config.cors));
app.use(morganMiddleware);

app.use('/api/v1', routes);

import { UAParser } from 'ua-parser-js';
import { UserRepository } from './repositories/users.repository';
import { z } from 'zod';
import { ApiMessages } from './constants/api-messages';

const sampleSchema = z.object({
  name: z
    .string()
    .nonempty({ message: ApiMessages.VALIDATION.REQUIRED('Name'), abort: true })
    .min(5, { message: ApiMessages.VALIDATION.MIN_LENGTH('Name', 5), abort: true })
    .max(10, { message: ApiMessages.VALIDATION.MAX_LENGTH('Name', 10), abort: true }),
  password: z.string().min(6).max(100),
});

app.get('/', async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  console.log('IPS:', { reqIp: req.ip, clientIp });
  const location = await getLocationFromIp(clientIp!);
  console.log('Location:', location);
  const parser = new UAParser(req.headers['user-agent']);
  const result = parser.getResult();

  console.log(result);
  logger.info(location);
  return res.status(200).json({
    message: 'Server is running',
    success: true,
    location,
  });
});

const parser = new UAParser();
app.get('/two', async (req, res) => {
  const start = performance.now();

  const device = parser.setUA(req.headers['user-agent'] || '').getResult();

  const end = performance.now();
  const timeMs = (end - start).toFixed(2);
  console.log(`Detection time: ${timeMs}ms`);
  console.log(device);
  return res.status(200).json({
    message: 'Server is running',
    success: true,
    device,
    performanceMs: timeMs,
  });
});

app.get('/users', async (req, res) => {
  const parse = sampleSchema.safeParse(req.body);

  // logger.info('Check Validation:', parse.error?.issues.map((e)=>e.code==="invalid_type" ?{}));

  return res.status(200).json({
    message: 'Server is running',
    success: true,
    error: parse.error?.issues,
  });
});

app.post('/users', async (req, res) => {
  const user = await UserRepository.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { password: false }
  );
  return res.status(200).json({
    message: 'Server is running',
    success: true,
    user,
  });
});

app.post('/create', async (req, res) => {
  const { name, email, password, id } = req.body;
  const user = await db.insert(users).values({
    id,
    email,
    password,
    name,
  });
  console.log(user);
  return res.status(200).json({
    message: 'Server is running',
    success: true,
    user: user,
  });
});

app.all('/*splat', (req, res) => {
  return res.status(404).json({
    message: 'Route not found',
    success: false,
  });
});

app.use(errorMiddleware);

export default app;
