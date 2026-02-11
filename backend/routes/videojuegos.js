const express = require('express');
const router = express.Router();
const videoGameController = require('../controllers/videoGameController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', videoGameController.getAll);
router.get('/:id', videoGameController.getOne);

// Protected routes
router.post('/', auth, videoGameController.create);
router.put('/:id', auth, videoGameController.update);
router.delete('/:id', auth, videoGameController.delete);

module.exports = router;
