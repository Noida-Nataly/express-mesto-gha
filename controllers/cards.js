const Card = require('../models/card');
const {
  ERROR_INVALID_DATA,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require('../errors/errors');

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('InvalidId'))
    .then(() => res.send({ message: 'Место удалено' }))
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERROR_NOT_FOUND).send({ message: `Карточка с указанным id:${req.params.id} не найдена` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Некорректный идентификатор карты' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.likeCardById = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('InvalidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERROR_NOT_FOUND).send({ message: `Передан несуществующий id:${cardId} карточки` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Некорректный идентификатор карты' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};

module.exports.dislikeCardById = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .orFail(new Error('InvalidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'InvalidId') {
        res.status(ERROR_NOT_FOUND).send({ message: `Передан несуществующий id:${cardId} карточки` });
      } else if (err.name === 'CastError') {
        res.status(ERROR_INVALID_DATA).send({ message: 'Некорректный идентификатор карты' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Неизвестная ошибка' });
      }
    });
};
