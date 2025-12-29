import { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | any>;

type SelectFields<T> = Partial<Record<keyof T, boolean>>;

export type { AsyncHandler, SelectFields };
