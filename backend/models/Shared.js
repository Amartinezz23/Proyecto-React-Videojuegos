const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true }
});

const platformSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);
const Platform = mongoose.model('Platform', platformSchema);

module.exports = { Category, Platform };
