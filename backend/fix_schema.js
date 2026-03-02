const { sequelize, HiddenGame } = require('./db');

async function fixSchema() {
    try {
        await HiddenGame.drop();
        await sequelize.sync();
        console.log('HiddenGames table recreated with correct schema.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixSchema();
