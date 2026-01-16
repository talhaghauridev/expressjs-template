import { config } from '@/config/app.config';
import errorMiddleware from '@/middlewares/error.middleware';
import morganMiddleware from '@/middlewares/morgan.middleware';
import routes from '@/routes';
import { getDeviceInfo } from '@/utils/get-device-info';
import { getLocationFromIp } from '@/utils/get-location';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import requestIp from 'request-ip';

const app = express();
app.set('trust proxy', true);
app.use(helmet(config.helmet));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression(config.compression));
app.use(cors(config.cors));
app.use(morganMiddleware);

app.use('/api/v1', routes);

app.get('/', async (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const location = await getLocationFromIp(clientIp!);
  const device = getDeviceInfo(req);

  return res.status(200).json({
    message: 'Server is running',
    success: true,
    location,
    device,
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
