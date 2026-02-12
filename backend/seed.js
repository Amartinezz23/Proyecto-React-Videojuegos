const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('./models/Game');
const { Category, Platform } = require('./models/Shared');
const fs = require('fs');
const path = require('path');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/videojuegos';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
    try {
        const dataPath = path.join(__dirname, 'Videojuegos.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);

        // Clear existing data
        await Category.deleteMany({});
        await Platform.deleteMany({});
        await Game.deleteMany({});

        console.log('Cleared existing data');

        // Insert Categories
        await Category.insertMany(data.categorias);
        console.log('Categories seeded');

        // Insert Platforms
        await Platform.insertMany(data.plataformas);
        console.log('Platforms seeded');

        // Insert Games
        // We need to map the game data to match our schema
        // Note: The original JSON has numerical IDs for categories/platforms, which matches our Shared.js schema
        // The Game model uses 'user' field, but legacy games don't have users. We'll leave it null or assign to a default admin if we had one.
        // We'll proceed with creating them as "anonymous" or "system" games for now.

        // Convert string IDs to numbers if necessary, but schema says Number for shared refs
        const games = data.videojuegos.map(g => ({
            nombre: g.nombre,
            descripcion: g.descripcion,
            fechaLanzamiento: g.fechaLanzamiento,
            compania: g.compania,
            plataformas: g.plataformas,
            categorias: g.categorias,
            precio: g.precio,
            urlImagen: g.urlImagen,
            urlVideo: g.urlVideo,
            username: 'System' // Indicate these are system/legacy games
        }));

        await Game.insertMany(games);
        console.log('Games seeded');

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
