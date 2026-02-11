const { Platform } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const platforms = await Platform.findAll();
        res.json(platforms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platforms', error: error.message });
    }
};
