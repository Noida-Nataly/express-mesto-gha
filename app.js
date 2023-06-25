// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const authMiddleware = require('./middlewares/auth');
const errorsMiddleware = require('./middlewares/errors');
const userController = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');

const regex = /^(https?:\/\/)?[^\s]*/;

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().min(3),
      password: Joi.string().required().min(3),
    }),
  }),
  userController.login,
);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(3),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
  }),
}), userController.createUser);

app.use(authMiddleware.auth);

app.use('/cards', cardRouter);
app.use('/users', userRouter);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT);
