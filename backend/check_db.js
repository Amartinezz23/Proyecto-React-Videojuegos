const { sequelize } = require('./db');

async function checkSchema() {
    try {
        const [results] = await sequelize.query("PRAGMA table_info(Videojuegos)");
        console.log("Schema for Videojuegos:");
        console.log(JSON.stringify(results, null, 2));

        const [users] = await sequelize.query("SELECT id, username FROM Users");
        console.log("\nUsers in DB:");
        console.log(JSON.stringify(users, null, 2));

        const [games] = await sequelize.query("SELECT id, nombre, urlImagen, UserId, isGeneric FROM Videojuegos");
        console.log("\nGames in DB:");
        console.log(JSON.stringify(games, null, 2));

        const [hidden] = await sequelize.query("SELECT * FROM HiddenGames");
        console.log("\nHidden Games in DB:");
        console.log(JSON.stringify(hidden, null, 2));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSchema();
