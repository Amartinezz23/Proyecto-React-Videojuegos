import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Container, Paper } from '@mui/material';
import ListarVideojuegos from './ListarVideojuegos';
import Loading from './Loading';
import { useAuth } from './AuthContext';
import PersonIcon from '@mui/icons-material/Person';

const API_URL = 'http://localhost:5000/api';

const MyGamesPage = ({ onClickVideojuego }) => {
    const { token } = useAuth();
    const [videojuegos, setVideojuegos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [response] = await Promise.all([
                axios.get(`${API_URL}/videojuegos/mine`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                new Promise(resolve => setTimeout(resolve, 4000)) // Force 4s
            ]);
            setVideojuegos(response.data);
        } catch (error) {
            console.error("Error fetching my games:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Box>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #fff, #3a7bd5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    My Video Games
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                    Manage the titles you've added to the platform.
                </Typography>
            </Box>

            <section>
                {videojuegos.length > 0 ? (
                    <ListarVideojuegos
                        juegos={videojuegos}
                        onClickVideojuego={onClickVideojuego}
                    />
                ) : (
                    <Paper
                        sx={{
                            p: 8,
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '20px',
                            border: '1px dashed rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            You haven't added any games yet.
                        </Typography>
                    </Paper>
                )}
            </section>
        </Box>
    );
};

export default MyGamesPage;
