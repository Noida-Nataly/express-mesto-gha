const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCardById,
  dislikeCardById,
  likeCardById,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);
router.put('/:cardId/likes', likeCardById);
router.delete('/:cardId/likes', dislikeCardById);

module.exports = router;
