import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper } from '@mui/material';
import Formulario from './Formulario';
import { useAuth } from './AuthContext';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const API_URL = 'http://localhost:5000/api';

const AddGamePage = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [plataformas, setPlataformas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [c, p] = await Promise.all([
                    axios.get(`${API_URL}/categorias`),
                    axios.get(`${API_URL}/plataformas`)
                ]);
                setCategorias(c.data);
                setPlataformas(p.data);
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };
        fetchData();
    }, []);

    const handleAgregar = async (juego) => {
        try {
            await axios.post(`${API_URL}/videojuegos`, juego, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/mis-juegos');
        } catch (error) {
            console.error("Error adding game:", error);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <AddCircleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #fff, #00d2ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Add New Video Game
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                    Share your latest discovery with the community.
                </Typography>
            </Box>

            <Formulario
                categorias={categorias}
                plataformas={plataformas}
                onAgregarJuego={handleAgregar}
            />
        </Container>
    );
};

export default AddGamePage;
