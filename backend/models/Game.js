const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    fechaLanzamiento: { type: String }, // Keeping as String to match JSON format YYYY-MM-DD
    compania: { type: String },
    plataformas: [{ type: Number }], // Storing IDs as numbers to match existing frontend logic
    categorias: [{ type: Number }], // Storing IDs as numbers
    precio: { type: Number },
    urlImagen: { type: String },
    urlVideo: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner
    username: { type: String } // Storing username directly for easier display as per requirements
});

gameSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

module.exports = mongoose.model('Game', gameSchema);
