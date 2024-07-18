import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { constants } from 'http2';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';
import User from '../models/user.model';
import UnauthorizedError from "../errors/unauthorized-error";

const { JWT_SECRET = 'some-secret-key' } = process.env;

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).orFail(() => new NotFoundError('Пользователь не найден'));
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }
};

export const getUser = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(res.locals.user._id);
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashPassword });
    return res.status(constants.HTTP_STATUS_CREATED).send(user);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(new ConflictError('Email уже используется'));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

const updateUser = async (userId: string, updateData: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).orFail(() => new NotFoundError('Пользователь не найден'));
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};
// игнор ошибки eslint - если исправить, будет другая ошибка с max-length
// eslint-disable-next-line arrow-body-style
export const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  return updateUser(res.locals.user._id, {
    name: req.body?.name,
    about: req.body?.about,
  }, res, next);
};
// игнор ошибки eslint - если исправить, будет другая ошибка с max-length
// eslint-disable-next-line arrow-body-style
export const updateAvatar = async (req: any, res: Response, next: NextFunction) => {
  return updateUser(res.locals.user._id, { avatar: req.body.avatar }, res, next);
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').orFail(() => new UnauthorizedError('Неправильные почта или пароль'));
    const isCheckPassword = await bcrypt.compare(password, user.password);
    if (isCheckPassword) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.status(constants.HTTP_STATUS_OK).send({ token });
    }
    return new UnauthorizedError('Неправильные почта или пароль');
  } catch (error) {
    return next(error);
  }
};
