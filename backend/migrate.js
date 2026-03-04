const fs = require('fs');
const path = require('path');
const { sequelize, User, Videojuego, Categoria, Plataforma } = require('./db');
const bcrypt = require('bcryptjs');

async function migrate() {
    try {
        await sequelize.sync({ force: true }); // Reset DB for migration
        console.log('Database synced.');

        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'Videojuegos.json'), 'utf8'));

        // Create a default admin user for existing games
        const hashedPassword = await bcrypt.hash('admin123', 8);
        const admin = await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Default admin created.');

        // Migrate Categories
        for (const cat of data.categorias) {
            await Categoria.create({ id: parseInt(cat.id), nombre: cat.nombre });
        }
        console.log('Categories migrated.');

        // Migrate Platforms
        for (const plat of data.plataformas) {
            await Plataforma.create({ id: parseInt(plat.id), nombre: plat.nombre });
        }
        console.log('Platforms migrated.');

        // Migrate Games
        for (const juego of data.videojuegos) {
            await Videojuego.create({
                nombre: juego.nombre,
                descripcion: juego.descripcion,
                urlImagen: juego.urlImagen,
                compania: juego.compania,
                precio: juego.precio.toString(),
                categorias: juego.categorias,
                plataformas: juego.plataformas,
                UserId: admin.id,
                isGeneric: true
            });
        }
        console.log('Games migrated.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

migrate();
