const Game = require('../models/Game');
const { Category, Platform } = require('../models/Shared');

// Hardcoded data for fallback/initialization
const INITIAL_CATEGORIES = [
    { id: 1, nombre: "Lucha" }, { id: 2, nombre: "Arcade" }, { id: 3, nombre: "Plataformas" },
    { id: 4, nombre: "Shooter" }, { id: 5, nombre: "Estrategia" }, { id: 6, nombre: "Simulación" },
    { id: 7, nombre: "Deporte" }, { id: 8, nombre: "Aventura" }, { id: 9, nombre: "Rol" },
    { id: 10, nombre: "Educación" }, { id: 11, nombre: "Puzzle" }
];

const INITIAL_PLATFORMS = [
    { id: 1, nombre: "PC" }, { id: 2, nombre: "PS5" }, { id: 3, nombre: "Xbox One" },
    { id: 4, nombre: "Switch" }, { id: 5, nombre: "Android" }, { id: 6, nombre: "iOS" },
    { id: 7, nombre: "Otras" }
];

const getCategories = async (req, res) => {
    // Return hardcoded for simplicity as per requirements (User CRUD not requested for these)
    res.json(INITIAL_CATEGORIES);
};

const getPlatforms = async (req, res) => {
    res.json(INITIAL_PLATFORMS);
};

const getAllGames = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const games = await Game.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Game.countDocuments();

        // Return structured response as expected by frontend
        // Frontend expects: setVideojuegos(response.data.videojuegos || response.data);
        // And setTotalPaginas(response.data.totalPaginas || 1);

        res.json({
            videojuegos: games,
            totalPaginas: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyGames = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    try {
        const games = await Game.find({ user: userId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Game.countDocuments({ user: userId });

        res.json({
            videojuegos: games,
            totalPaginas: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGame = async (req, res) => {
    // Frontend sends: nombre, descripcion, precio, categorias (array IDs), plataformas (array IDs), etc.
    const gameData = req.body;

    try {
        const newGame = new Game({
            ...gameData,
            user: req.user.id,
            username: req.user.username // Store username for display
        });

        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteGame = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Juego no encontrado' });

        // Check permissions: Owner or Admin
        if (game.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este juego' });
        }

        await Game.findByIdAndDelete(req.params.id);
        res.json({ message: 'Juego eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllGames,
    getMyGames,
    getGameById,
    createGame,
    deleteGame,
    getCategories,
    getPlatforms
};
