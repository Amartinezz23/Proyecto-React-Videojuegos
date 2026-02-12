const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes for static data
router.get('/categorias', gameController.getCategories);
router.get('/plataformas', gameController.getPlatforms);

// Game routes
router.get('/videojuegos', gameController.getAllGames);
router.get('/videojuegos/mis-juegos', authMiddleware, gameController.getMyGames);
router.get('/videojuegos/:id', gameController.getGameById);
router.post('/videojuegos', authMiddleware, gameController.createGame);
router.delete('/videojuegos/:id', authMiddleware, gameController.deleteGame);

module.exports = router;
