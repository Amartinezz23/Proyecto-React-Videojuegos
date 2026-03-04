require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, Videojuego, Categoria, Plataforma, HiddenGame, Voto, Comentario, Reporte } = require('./db');
const axios = require('axios');
const { Op } = require('sequelize');
const { auth, isAdmin } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
            if (hiddenIds.length > 0) {
                where.id = { [Op.notIn]: hiddenIds };
            }
        }

        const { count, rows } = await Videojuego.findAndCountAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['username'] },
                { model: Voto, as: 'votos', attributes: ['valor'] }
            ],
            distinct: true,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sort === 'popularity' ? 'id' : sort, 'DESC']]
        });

        const gamesWithVotes = rows.map(game => {
            const plainGame = game.get({ plain: true });
            const likesCount = (plainGame.votos || []).filter(v => v.valor === 'like').length;
            const dislikesCount = (plainGame.votos || []).filter(v => v.valor === 'dislike').length;
            return {
                ...plainGame,
                likes: likesCount,
                dislikes: dislikesCount,
                popularity: likesCount - dislikesCount
            };
        });

        if (sort === 'popularity') {
            gamesWithVotes.sort((a, b) => b.popularity - a.popularity);
        }

        res.json({
            data: gamesWithVotes,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Voting Route
app.post('/api/videojuegos/:id/votar', auth, async (req, res) => {
    try {
        const { valor } = req.body;
        if (!['like', 'dislike'].includes(valor)) {
            return res.status(400).json({ error: 'Invalid vote value' });
        }

        const [voto, created] = await Voto.findOrCreate({
            where: { UserId: req.user.id, VideojuegoId: req.params.id },
            defaults: { valor }
        });

        if (!created) {
            await voto.update({ valor });
        }

        res.json({ message: 'Vote registered', voto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Game Routes - Only Mine
app.get('/api/videojuegos/mine', auth, async (req, res) => {
    try {
        const hidden = await HiddenGame.findAll({ where: { UserId: req.user.id } });
        const hiddenIds = hidden.map(h => h.VideojuegoId);
        console.log(`Getting games for user ${req.user.id}, hidden:`, hiddenIds);

        let where = { UserId: req.user.id };
        if (hiddenIds.length > 0) {
            where.id = { [Op.notIn]: hiddenIds };
        }
        console.log('Final where clause:', where);

        const games = await Videojuego.findAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/videojuegos/:id', async (req, res) => {
    try {
        const game = await Videojuego.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['username'] },
                { model: Voto, as: 'votos', attributes: ['valor'] },
                { model: Comentario, as: 'comentarios', attributes: ['id'] }
            ]
        });
        if (!game) return res.status(404).json({ error: 'Game not found' });

        const plainGame = game.get({ plain: true });
        const likesCount = (plainGame.votos || []).filter(v => v.valor === 'like').length;
        const dislikesCount = (plainGame.votos || []).filter(v => v.valor === 'dislike').length;
        const commentsCount = (plainGame.comentarios || []).length;

        res.json({
            ...plainGame,
            likes: likesCount,
            dislikes: dislikesCount,
            popularity: likesCount - dislikesCount,
            commentsCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Comment Routes
app.post('/api/videojuegos/:id/comentarios', auth, async (req, res) => {
    try {
        const { texto, parentId } = req.body;
        const comentario = await Comentario.create({
            texto,
            parentId,
            UserId: req.user.id,
            VideojuegoId: req.params.id
        });
        res.status(201).json(comentario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/videojuegos/:id/comentarios', async (req, res) => {
    try {
        const comentarios = await Comentario.findAll({
            where: { VideojuegoId: req.params.id, parentId: null },
            include: [
                { model: User, as: 'user', attributes: ['username'] },
                {
                    model: Comentario,
                    as: 'replies',
                    include: [{ model: User, as: 'user', attributes: ['username'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/comentarios/:id', auth, async (req, res) => {
    try {
        const comentario = await Comentario.findByPk(req.params.id, {
            include: [{ model: Comentario, as: 'replies' }]
        });
        if (!comentario) return res.status(404).json({ error: 'Comment not found' });

        // Admin can delete anything. User can delete own if no replies.
        if (req.user.role !== 'admin') {
            if (comentario.UserId !== req.user.id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
            if (comentario.replies && comentario.replies.length > 0) {
                return res.status(400).json({ error: 'Cannot delete comment with replies' });
            }
        }

        await comentario.destroy();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.post('/api/videojuegos', auth, async (req, res) => {
    try {
        const game = await Videojuego.create({ ...req.body, UserId: req.user.id });
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/videojuegos/:id', auth, async (req, res) => {
    try {
        const game = await Videojuego.findByPk(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });

        if (game.UserId !== req.user.id && req.user.role !== 'admin') {
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

        console.log(`User ${req.user.id} (${req.user.role}) attempting to delete game ${game.id}`);

        // Admin can delete anything permanently
        if (req.user.role === 'admin') {
            await game.destroy();
            console.log(`Game ${game.id} permanently deleted by admin`);
            return res.json({ message: 'Game permanently deleted by admin' });
        }

        // Users hide for themselves
        await HiddenGame.findOrCreate({
            where: { UserId: req.user.id, VideojuegoId: game.id }
        });

        console.log(`Game ${game.id} hidden for user ${req.user.id}`);
        res.json({ message: 'Game hidden from your view' });
    } catch (error) {
        console.error('Delete error:', error);
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

// Reporting Routes
app.post('/api/videojuegos/:id/reportar', auth, async (req, res) => {
    try {
        const { motivo } = req.body;
        const reporte = await Reporte.create({
            motivo,
            UserId: req.user.id,
            VideojuegoId: req.params.id
        });
        res.status(201).json(reporte);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/admin/reportados', auth, isAdmin, async (req, res) => {
    try {
        const reportados = await Videojuego.findAll({
            include: [
                { model: Reporte, as: 'reportes', required: true },
                { model: User, as: 'user', attributes: ['username'] }
            ]
        });
        res.json(reportados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Assistant Route
app.post('/api/ai/chat', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

        // 1. Fetch data for context
        const [games, cats, plats] = await Promise.all([
            Videojuego.findAll(),
            Categoria.findAll(),
            Plataforma.findAll()
        ]);

        const catMap = Object.fromEntries(cats.map(c => [c.id, c.nombre]));
        const platMap = Object.fromEntries(plats.map(p => [p.id, p.nombre]));

        // Map IDs to names for the AI
        const gamesList = games.map(g => ({
            id: g.id,
            nombre: g.nombre,
            descripcion: g.descripcion,
            compania: g.compania,
            precio: g.precio,
            categorias: Array.isArray(g.categorias) ? g.categorias.map(id => catMap[id] || id) : [],
            plataformas: Array.isArray(g.plataformas) ? g.plataformas.map(id => platMap[id] || id) : []
        }));

        const systemPrompt = `You are a helpful video game assistant for a specialized catalog. 
Your goal is to help users find and recommend games ONLY from our current database.
DATABASE: ${JSON.stringify(gamesList)}

RULES:
1. ONLY recommend games that are listed in the DATABASE above.
2. If the user asks for a game NOT in the database, politely explain that we don't have it and suggest something similar from our catalog.
3. Be concise and helpful. Don't mention the internal database format or JSON.
4. If asked about prices, use the data from the database.
5. Use a friendly, gaming-expert tone.
6. IMPORTANT: Do NOT include your internal reasoning or <think> tags. Only provide the final response to the user.`;

        // 2. Call Ollama
        const ollamaResponse = await axios.post(`${ollamaUrl}/api/generate`, {
            model: 'lfm2.5-thinking',
            prompt: `System: ${systemPrompt}\nUser: ${message}\nAssistant:`,
            stream: false
        });

        let aiResponse = ollamaResponse.data.response;

        // Clean thinking tags: remove everything from <think> up to and including </think>
        aiResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ error: 'AI Assistant is currently unavailable. Make sure Ollama is running.' });
    }
});

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Database synchronized.');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to start server:', err);
    });
