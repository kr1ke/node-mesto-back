import express from 'express';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import router from './routes';
import errorHandler from './middleware/error-handler';
import { requestLogger, errorLogger } from './middleware/logger';
import { login, createUser } from './controllers/users.controller';
import checkAuth from './middleware/auth';
import { urlCheckRegex } from "./errors/validation";

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
app.use(express.json());

app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    email: Joi.string().required().email(),
    password: Joi.required(),
    avatar: Joi.string().pattern(urlCheckRegex, 'Url'),
  }),
}), createUser);
app.use(checkAuth);
app.use('/', router);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // наш централизованный обработчик
app.use(errorLogger);

const init = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    await mongoose.connect(MONGO_URL.toString());
    await app.listen(PORT);
    console.log(`Listening on port ${PORT}`);
  } catch (err) {
    throw err;
  }
};

init();
