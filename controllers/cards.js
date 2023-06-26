const Card = require('../models/card');
const UnknownError = require('../errors/unknown-err');
const InvalidDataError = require('../errors/invalid-data-err');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedError = require('../errors/access-denied-err');

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(new UnknownError());
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new UnknownError()));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(new Error('InvalidId'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return Promise.reject(new Error('Извините, но Вы не можете удалить чужое место'));
      }
      return Card.deleteOne(card)
        .then(() => res.send({ message: 'Место удалёно' }));
    })

    .catch((err) => {
      if (err.message === 'Извините, но Вы не можете удалить чужое место') {
        next(new AccessDeniedError('Извините, но Вы не можете удалить чужое место'));
      } else if (err.message === 'InvalidId') {
        next(new NotFoundError(`Карточка с указанным id:${req.params.id} не найдена`));
      } else if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректный идентификатор карты'));
      } else {
        next(new UnknownError());
      }
    });
};

module.exports.likeCardById = (req, res, next) => {
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
        next(new NotFoundError(`Передан несуществующий id:${cardId} карточки`));
      } else if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректный идентификатор карты'));
      } else {
        next(new UnknownError());
      }
    });
};

module.exports.dislikeCardById = (req, res, next) => {
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
        next(new NotFoundError(`Передан несуществующий id:${cardId} карточки`));
      } else if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректный идентификатор карты'));
      } else {
        next(new UnknownError());
      }
    });
};
