const User = require('../models/user');
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require('../errors/errors');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('InvalidID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'InvalidID') {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь по указанному id:${req.params.userId} не найден` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Некорректный идентификатор пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('InvalidID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'InvalidID') {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь по указанному id:${req.user._id} не найден` });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Некорректный идентификатор пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('InvalidID'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'InvalidID') {
        res.status(ERROR_NOT_FOUND).send({ message: `Пользователь по указанному id:${req.user._id} не найден` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Некорректный идентификатор пользователя' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};
