import { User } from '@/database/schema';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: Partial<Omit<User, 'password'>>;
    }
  }
}

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | any>;

type SelectFields<T> = Partial<Record<keyof T, boolean>>;

export type { AsyncHandler, SelectFields };
