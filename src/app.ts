import { config } from '@/config/app.config';
import errorMiddleware from '@/middlewares/error.middleware';
import morganMiddleware from '@/middlewares/morgan.middleware';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import routes from '@/routes';
import { db } from './database/db';
import { users } from './database/schema';
import ApiError from './utils/api-error';

const app = express();

app.use(helmet(config.helemt));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression(config.compression));
app.use(cors(config.cors));
app.use(morganMiddleware);

app.use('/api/v1', routes);

app.get('/', async (req, res) => {
  const _users = await db.query.users.findMany();
  console.log(_users);

  return res.status(200).json({
    message: 'Server is running',
    success: true,
    users: _users,
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
