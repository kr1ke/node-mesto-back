import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import Card from '../models/card.model';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const getCards = async (_req: Request, res: Response, next:NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(constants.HTTP_STATUS_OK).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const card = await Card.create({ ...req.body, owner: res.locals.user._id });
    return res.status(constants.HTTP_STATUS_CREATED).send(card);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return next(new NotFoundError('Карточка с таким _id не найдена'));
    }
    if (card.owner.toString() !== res.locals.user._id) {
      return next(new ForbiddenError('Недостаточно прав'));
    }
    await Card.deleteOne({ _id: req.params.id }).orFail(() => new NotFoundError('Карточка с таким _id не найдена'));
    return res.status(constants.HTTP_STATUS_OK).send({ _id: req.params.id });
  } catch (error) {
    return next(error);
  }
};

export const likeCard = async (req: any, res: Response, next:NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: res.locals.user._id } }, // добавить _id в массив, если его там нет
      { new: true },

    ).orFail(() => new NotFoundError('Карточка с таким _id не найдена'));
    return res.status(constants.HTTP_STATUS_OK).send(card);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }
};

export const dislikeCard = async (req: any, res: Response, next:NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: res.locals.user._id } }, // убрать _id из массива
      { new: true },
    ).orFail(() => new NotFoundError('Карточка с таким _id не найдена'));
    return res.status(constants.HTTP_STATUS_OK).send(card);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Не валидный id'));
    }
    return next(error);
  }
};
