const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные при создании карточки.');
      } else {
        res.status(500).send('Неизвестная ошибка');
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send('Неизвестная ошибка'));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(() => res.send({ message: 'Место удалено' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Карточка с указанным id:${req.params.userId} не найдена`);
      } else {
        res.status(500).send('Неизвестная ошибка');
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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Передан несуществующий id:${req.params.userId} карточки`);
      } else if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные для постановки/снятия лайка.');
      } else {
        res.status(500).send('Неизвестная ошибка');
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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send(`Передан несуществующий id:${req.params.userId} карточки`);
      } else if (err.name === 'ValidationError') {
        res.status(400).send('Переданы некорректные данные для постановки/снятия лайка.');
      } else {
        res.status(500).send('Неизвестная ошибка');
      }
    });
};
