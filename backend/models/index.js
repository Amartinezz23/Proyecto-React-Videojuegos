const User = require('./User');
const VideoGame = require('./VideoGame');
const Category = require('./Category');
const Platform = require('./Platform');

// Many-to-Many: VideoGames <-> Categories
VideoGame.belongsToMany(Category, { through: 'VideoGameCategories', as: 'categorias', foreignKey: 'videoGameId' });
Category.belongsToMany(VideoGame, { through: 'VideoGameCategories', as: 'videojuegos', foreignKey: 'categoryId' });

// Many-to-Many: VideoGames <-> Platforms
VideoGame.belongsToMany(Platform, { through: 'VideoGamePlatforms', as: 'plataformas', foreignKey: 'videoGameId' });
Platform.belongsToMany(VideoGame, { through: 'VideoGamePlatforms', as: 'videojuegos', foreignKey: 'platformId' });

module.exports = {
    User,
    VideoGame,
    Category,
    Platform
};
