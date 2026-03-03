require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Videojuego, Categoria, Plataforma, HiddenGame } = require('./db');
const { Op } = require('sequelize');
const { auth, isAdmin } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ username, password: hashedPassword, role: role || 'user' });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed: ' + error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Categories & Platforms Routes
app.get('/api/categorias', async (req, res) => {
    try {
        const cats = await Categoria.findAll();
        res.json(cats);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/plataformas', async (req, res) => {
    try {
        const plats = await Plataforma.findAll();
        res.json(plats);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Game Routes - All (Generic + Users)
app.get('/api/videojuegos', async (req, res) => {
    try {
        const authHeader = req.header('Authorization');
        let userId = null;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) { }
        }

        const { page = 1, limit = 10, sort = 'id' } = req.query;
        const offset = (page - 1) * limit;

        let where = {};
        if (userId) {
            const hidden = await HiddenGame.findAll({ where: { UserId: userId } });
            const hiddenIds = hidden.map(h => h.VideojuegoId);
            where = { id: { [Op.notIn]: hiddenIds } };
        }

        const { count, rows } = await Videojuego.findAndCountAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['username'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sort === 'popularity' ? 'id' : sort, 'DESC']] // Temporary: popularity logic will be refined in next iteration
        });

        res.json({
            data: rows,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Game Routes - Only Mine
app.get('/api/videojuegos/mine', auth, async (req, res) => {
    try {
        const games = await Videojuego.findAll({
            where: { userId: req.user.id },
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/videojuegos', auth, async (req, res) => {
    try {
        const game = await Videojuego.create({ ...req.body, userId: req.user.id });
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/videojuegos/:id', auth, async (req, res) => {
    try {
        const game = await Videojuego.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        if (game.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to update this game' });
        }

        await game.update(req.body);
        res.json(game);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/videojuegos/:id', auth, async (req, res) => {
    try {
        const game = await Videojuego.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        // Admin can delete anything permanently
        if (req.user.role === 'admin') {
            await game.destroy();
            return res.json({ message: 'Game permanently deleted by admin' });
        }

        // Users can hide generic games or games added by others
        // BUT they can "delete" (hide) their own games too
        // The user specifically asked: "el usuario solo puede borrar sus juegos"
        // This usually means they can't delete other people's stuff.
        // But they also said: "si juan borrar su juego, pepito le siga saliendo"
        // So User "Delete" = Hide for self.

        await HiddenGame.findOrCreate({
            where: { UserId: req.user.id, VideojuegoId: game.id }
        });

        res.json({ message: 'Game hidden from your view' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin only: Initialize data
app.post('/api/init', auth, isAdmin, async (req, res) => {
    try {
        await Categoria.bulkCreate([
            { nombre: 'Acción' }, { nombre: 'Aventura' }, { nombre: 'RPG' }, { nombre: 'Deportes' }
        ]);
        await Plataforma.bulkCreate([
            { nombre: 'PC' }, { nombre: 'PS5' }, { nombre: 'Xbox Series X' }, { nombre: 'Nintendo Switch' }
        ]);
        res.json({ message: 'Data initialized' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
