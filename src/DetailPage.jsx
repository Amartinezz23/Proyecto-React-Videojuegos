import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Stack,
    Divider,
    IconButton,
    Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Loading from './Loading';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [juego, setJuego] = useState(null);

    useEffect(() => {
        const fetchJuego = async () => {
            try {
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                const [response] = await Promise.all([
                    axios.get(`${API_URL}/videojuegos`, config),
                    new Promise(resolve => setTimeout(resolve, 4000)) // Force 4s
                ]);
                const found = response.data.find(j => j.id.toString() === id);
                setJuego(found);
            } catch (error) {
                console.error("Error fetching game detail:", error);
            }
        };
        fetchJuego();
    }, [id, token]);

    const handleEliminar = async () => {
        if (!window.confirm("Are you sure you want to delete/hide this game?")) return;
        try {
            await axios.delete(`${API_URL}/videojuegos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(-1);
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting game");
        }
    };

    if (!juego) return <Loading />;

    return (
        <Box sx={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}
            >
                Back Catalog
            </Button>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, md: 4 },
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    overflow: 'hidden'
                }}
            >
                <Grid container spacing={6}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            lineHeight: 0
                        }}>
                            <img
                                src={juego.urlImagen}
                                alt={juego.nombre}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                                    {juego.nombre}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        {juego.compania}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                {juego.precio} €
                            </Typography>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                            <Box>
                                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>Description</Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                                    {juego.descripcion}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountCircleIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    Added by <strong>{juego.user?.username || 'System'}</strong>
                                </Typography>
                            </Stack>

                            <Box sx={{ pt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleEliminar}
                                    sx={{
                                        borderRadius: '12px',
                                        borderColor: 'rgba(255, 68, 68, 0.3)',
                                        '&:hover': {
                                            borderColor: '#ff4444',
                                            background: 'rgba(255, 68, 68, 0.1)'
                                        }
                                    }}
                                >
                                    {user.role === 'admin' ? 'Delete Permanently' : 'Remove from My View'}
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default DetailPage;
