const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Неизвестная ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('InvalidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'InvalidId') {
        res.status(404).send({ message: `Пользователь по указанному id:${req.params.userId} не найден` });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный идентификатор пользователя' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Пользователь по указанному id:${req.params.userId} не найден` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: `Пользователь по указанному id:${req.params.userId} не найден` });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(500).send({ message: 'Неизвестная ошибка' });
      }
    });
};
