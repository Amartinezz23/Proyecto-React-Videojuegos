const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for images if needed (optional based on updated reqs, but good practice)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (to be imported)
const authRoutes = require('./routes/auth');
const videoGameRoutes = require('./routes/videojuegos');
const categoryRoutes = require('./routes/categorias');
const platformRoutes = require('./routes/plataformas');

// Use Routes
app.use('/auth', authRoutes);
app.use('/videojuegos', videoGameRoutes);
app.use('/categorias', categoryRoutes);
app.use('/plataformas', platformRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Video Games API' });
});

// Sync Database and Start Server
sequelize.sync({ force: false }) // Set force: true to drop tables on startup (good for dev initially)
    .then(() => {
        console.log('Database connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
