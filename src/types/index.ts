import { NextFunction, Request, Response } from 'express';

type AuthRequestInfo = {
  userId: string;
  email: string;
  id: string;
  username: string;
  fullName: string;
  provider: string;
};

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | any>;

type SelectFields<T> = Partial<Record<keyof T, boolean>>;

export type { AsyncHandler, AuthRequestInfo, SelectFields };
