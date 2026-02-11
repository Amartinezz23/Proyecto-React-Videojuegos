const { VideoGame, Category, Platform } = require('../models');

// Get all video games
exports.getAll = async (req, res) => {
    try {
        const games = await VideoGame.findAll({
            include: [
                { model: Category, as: 'categorias', through: { attributes: [] } },
                { model: Platform, as: 'plataformas', through: { attributes: [] } }
            ]
        });
        // Transform to match frontend expectations if necessary
        // Example: categories might simpler array of IDs in some contexts, but full objects usually better.
        // The previous json-server returned ids in arrays 'categorias': [1, 2]
        // We might need to adjust response format or frontend.
        // For now, let's return full objects and see if frontend adapts or we adapt here.
        // Actually, looking at App.jsx lines 111-116:
        // juego.categorias.every(id => ...)
        // It expects `juego.categorias` to be an array of IDs!

        // Let's adhere to the existing structure for compatibility first.
        const formattedGames = games.map(game => {
            const g = game.toJSON();
            g.categorias = g.categorias.map(c => c.id);
            g.plataformas = g.plataformas.map(p => p.id);
            return g;
        });

        res.json(formattedGames);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching games', error: error.message });
    }
};

// Get single game
exports.getOne = async (req, res) => {
    try {
        const game = await VideoGame.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'categorias' },
                { model: Platform, as: 'plataformas' }
            ]
        });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game', error: error.message });
    }
};

// Create game
exports.create = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, precio, fechaLanzamiento, compania, urlVideo, categorias, plataformas } = req.body;
        const newGame = await VideoGame.create({ titulo, descripcion, imagen, precio, fechaLanzamiento, compania, urlVideo });

        if (categorias && categorias.length > 0) {
            const categoryInstances = await Category.findAll({ where: { id: categorias } });
            await newGame.addCategorias(categoryInstances);
        }

        if (plataformas && plataformas.length > 0) {
            const platformInstances = await Platform.findAll({ where: { id: plataformas } });
            await newGame.addPlataformas(platformInstances);
        }

        // Reload to get associations
        const reloadedGame = await VideoGame.findByPk(newGame.id, {
            include: [
                { model: Category, as: 'categorias' },
                { model: Platform, as: 'plataformas' }
            ]
        });

        // Format for response compatible with frontend
        const g = reloadedGame.toJSON();
        g.categorias = g.categorias.map(c => c.id);
        g.plataformas = g.plataformas.map(p => p.id);

        res.status(201).json(g);
    } catch (error) {
        res.status(500).json({ message: 'Error creating game', error: error.message });
    }
};

// Update game
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, imagen, precio, fechaLanzamiento, compania, urlVideo, categorias, plataformas } = req.body;

        const game = await VideoGame.findByPk(id);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        await game.update({ titulo, descripcion, imagen, precio, fechaLanzamiento, compania, urlVideo });

        if (categorias) {
            const categoryInstances = await Category.findAll({ where: { id: categorias } });
            await game.setCategorias(categoryInstances);
        }

        if (plataformas) {
            const platformInstances = await Platform.findAll({ where: { id: plataformas } });
            await game.setPlataformas(platformInstances);
        }

        res.json(game);
    } catch (error) {
        res.status(500).json({ message: 'Error updating game', error: error.message });
    }
};

// Delete game
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await VideoGame.findByPk(id);
        if (!game) return res.status(404).json({ message: 'Game not found' });

        await game.destroy();
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting game', error: error.message });
    }
};
