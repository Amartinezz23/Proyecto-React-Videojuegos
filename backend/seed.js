const sequelize = require('./config/database');
const { User, VideoGame, Category, Platform } = require('./models');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const loadJSON = (filename) => {
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error('Error reading JSON file:', e);
            return {};
        }
    }
    return {};
};

const seedDatabase = async () => {
    try {
        // Reset database
        await sequelize.sync({ force: true });
        console.log('Database synced.');

        // 1. Create Default User
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword
        });
        console.log('Default user created: admin / admin123');

        // 2. Load Data from JSON
        const data = loadJSON('Videojuegos.json');
        const videojuegosData = data.videojuegos || [];
        const categoriasData = data.categorias || [];
        const plataformasData = data.plataformas || [];

        // 3. Seed Categories
        if (categoriasData.length > 0) {
            await Category.bulkCreate(categoriasData.map(c => ({
                id: Number(c.id),
                nombre: c.nombre
            })));
            console.log('Categories seeded.');
        }

        // 4. Seed Platforms
        if (plataformasData.length > 0) {
            await Platform.bulkCreate(plataformasData.map(p => ({
                id: Number(p.id),
                nombre: p.nombre
            })));
            console.log('Platforms seeded.');
        }

        // 5. Seed VideoGames and Associations
        if (videojuegosData.length > 0) {
            for (const game of videojuegosData) {
                // Create game mapping the fields
                const newGame = await VideoGame.create({
                    titulo: game.nombre, // Mapped from 'nombre'
                    descripcion: game.descripcion,
                    imagen: game.urlImagen, // Mapped from 'urlImagen'
                    precio: game.precio ? parseFloat(game.precio) : 0.0,
                    fechaLanzamiento: game.fechaLanzamiento,
                    compania: game.compania,
                    urlVideo: game.urlVideo
                });

                // Associate Categories
                if (game.categorias && game.categorias.length > 0) {
                    const categoryIds = game.categorias.map(id => Number(id));
                    const categories = await Category.findAll({
                        where: { id: categoryIds }
                    });
                    if (categories.length > 0) {
                        await newGame.addCategorias(categories);
                    }
                }

                // Associate Platforms
                if (game.plataformas && game.plataformas.length > 0) {
                    const platformIds = game.plataformas.map(id => Number(id));
                    const platforms = await Platform.findAll({
                        where: { id: platformIds }
                    });
                    if (platforms.length > 0) {
                        await newGame.addPlataformas(platforms);
                    }
                }
            }
            console.log('VideoGames seeded.');
        }

        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();
