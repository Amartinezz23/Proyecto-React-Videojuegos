const axios = require('axios');

const API_URL = 'http://localhost:3000';

const testAPI = async () => {
    try {
        console.log('--- Starting API Tests ---');

        // 1. Get All Games (Public)
        console.log('\n1. Testing GET /videojuegos...');
        const gamesRes = await axios.get(`${API_URL}/videojuegos`);
        console.log(`Success! Retrieved ${gamesRes.data.length} games.`);

        if (gamesRes.data.length > 0) {
            console.log('Sample game:', gamesRes.data[0].titulo);
        }

        // 2. Login (to get token)
        console.log('\n2. Testing POST /auth/login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log('Success! Logged in, token received.');

        // 3. Create Game (Protected)
        console.log('\n3. Testing POST /videojuegos (Create)...');
        const newGame = {
            titulo: 'Test Game',
            descripcion: 'A game created by test script',
            imagen: 'https://example.com/image.jpg',
            precio: 19.99,
            categorias: [1, 2], // Assuming these IDs exist
            plataformas: [1]
        };

        const createRes = await axios.post(`${API_URL}/videojuegos`, newGame, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success! Created game:', createRes.data.titulo, '(ID:', createRes.data.id, ')');
        const createdId = createRes.data.id;

        // 4. Update Game (Protected)
        console.log('\n4. Testing PUT /videojuegos/:id (Update)...');
        const updateRes = await axios.put(`${API_URL}/videojuegos/${createdId}`, {
            titulo: 'Test Game Updated',
            precio: 29.99
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success! Updated game:', updateRes.data.titulo, 'New Price:', updateRes.data.precio);

        // 5. Delete Game (Protected)
        console.log('\n5. Testing DELETE /videojuegos/:id (Delete)...');
        await axios.delete(`${API_URL}/videojuegos/${createdId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success! Deleted game.');

        console.log('\n--- All Tests Passed ---');
    } catch (error) {
        console.error('\n!!! Test Failed !!!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
};

// We need to wait for server to start before running tests?
// Since we can't easily start the server in background and run this in same script without complexity,
// we will assume server is running OR start it programmatically.
// Let's rely on manually starting server in background first.
testAPI();
