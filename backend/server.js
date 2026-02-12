const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/auth', authRoutes);
app.use('/', gameRoutes); // Mount at root so paths are /videojuegos, /categorias, etc.

app.get('/', (req, res) => {
    res.send('Video Games API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
