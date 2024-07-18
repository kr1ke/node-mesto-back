import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUser,
} from '../controllers/users.controller';
import { urlCheckRegex } from "../errors/validation";

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.get('/:id', celebrate({
  params: {
    id: Joi.string().length(24).hex().required(),
  },
}), getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }).or('name', 'about', 'avatar'),
}), updateProfile);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlCheckRegex, 'Url'),
  }),
}), updateAvatar);

export default usersRouter;
