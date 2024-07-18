import { Request, Response } from 'express';
import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthContext } from '../types/auth-context';
import UnauthorizedError from '../errors/unauthorized-error';

const { JWT_SECRET = 'some-secret-key' } = process.env;

export default (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  // @ts-ignore
  res.locals.user = payload;
  return next(); // пропускаем запрос дальше
};
