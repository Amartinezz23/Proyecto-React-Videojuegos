const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
});

const Videojuego = sequelize.define('Videojuego', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    urlImagen: {
        type: DataTypes.STRING
    },
    compania: {
        type: DataTypes.STRING
    },
    precio: {
        type: DataTypes.STRING
    },
    categorias: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    plataformas: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isGeneric: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

const Categoria = sequelize.define('Categoria', {
    nombre: { type: DataTypes.STRING, allowNull: false }
});

const Plataforma = sequelize.define('Plataforma', {
    nombre: { type: DataTypes.STRING, allowNull: false }
});

const HiddenGame = sequelize.define('HiddenGame', {
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    VideojuegoId: { type: DataTypes.INTEGER, allowNull: false }
});

const Voto = sequelize.define('Voto', {
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    VideojuegoId: { type: DataTypes.INTEGER, allowNull: false },
    valor: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['UserId', 'VideojuegoId']
        }
    ]
});

const Comentario = sequelize.define('Comentario', {
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    VideojuegoId: { type: DataTypes.INTEGER, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true }
});

const Reporte = sequelize.define('Reporte', {
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Relationships
User.hasMany(Videojuego, { foreignKey: 'UserId' });
Videojuego.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

User.belongsToMany(Videojuego, { through: HiddenGame, foreignKey: 'UserId', as: 'hiddenVideojuegos' });
Videojuego.belongsToMany(User, { through: HiddenGame, foreignKey: 'VideojuegoId', as: 'hidingUsers' });

User.hasMany(Voto, { foreignKey: 'UserId' });
Voto.belongsTo(User, { foreignKey: 'UserId' });

Videojuego.hasMany(Voto, { foreignKey: 'VideojuegoId', as: 'votos' });
Voto.belongsTo(Videojuego, { foreignKey: 'VideojuegoId' });

User.hasMany(Comentario, { foreignKey: 'UserId' });
Comentario.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

Videojuego.hasMany(Comentario, { foreignKey: 'VideojuegoId', as: 'comentarios' });
Comentario.belongsTo(Videojuego, { foreignKey: 'VideojuegoId' });

Comentario.hasMany(Comentario, { foreignKey: 'parentId', as: 'replies' });
Comentario.belongsTo(Comentario, { foreignKey: 'parentId', as: 'parent' });

User.hasMany(Reporte, { foreignKey: 'UserId' });
Reporte.belongsTo(User, { foreignKey: 'UserId' });

Videojuego.hasMany(Reporte, { foreignKey: 'VideojuegoId', as: 'reportes' });
Reporte.belongsTo(Videojuego, { foreignKey: 'VideojuegoId' });

module.exports = { sequelize, User, Videojuego, Categoria, Plataforma, HiddenGame, Voto, Comentario, Reporte };
