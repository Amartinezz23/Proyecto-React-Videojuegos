const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VideoGame = sequelize.define('VideoGame', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    fechaLanzamiento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    compania: {
        type: DataTypes.STRING,
        allowNull: true
    },
    urlVideo: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = VideoGame;
