import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards.controller';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
}), createCard);
cardsRouter.delete('/:id', celebrate({
  params: {
    id: Joi.string().length(24).hex().required(),
  },
}), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), dislikeCard);

export default cardsRouter;
