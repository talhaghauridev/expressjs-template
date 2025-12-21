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

export type { AsyncHandler, AuthRequestInfo };
