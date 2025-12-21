import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import errorMiddleware from '@/middlewares/error.middleware';
import { config } from '@/config/app.config';
import ApiError from './utils/api-error';

const app = express();

// Middleware
app.use(helmet(config.helemt));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression(config.compression));
app.use(cors(config.cors));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
  return res.status(200).json({
    message: 'Server is running',
    success: true,
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
