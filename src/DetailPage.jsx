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
    Chip,
    TextField,
    Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FlagIcon from '@mui/icons-material/Flag';
import Loading from './Loading';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5000/api';

const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [juego, setJuego] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');

    const fetchJuego = async () => {
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await axios.get(`${API_URL}/videojuegos/${id}`, config);
            setJuego(response.data);
        } catch (error) {
            console.error("Error fetching game detail:", error);
        }
    };

    const fetchComentarios = async () => {
        try {
            const response = await axios.get(`${API_URL}/videojuegos/${id}/comentarios`);
            setComentarios(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchJuego();
        fetchComentarios();
    }, [id, token]);

    const handleVote = async (valor) => {
        try {
            await axios.post(`${API_URL}/videojuegos/${id}/votar`, { valor }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchJuego();
        } catch (error) {
            alert(error.response?.data?.error || "Error voting");
        }
    };

    const handleAddComentario = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        try {
            await axios.post(`${API_URL}/videojuegos/${id}/comentarios`,
                { texto: nuevoComentario },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNuevoComentario('');
            fetchComentarios();
            fetchJuego(); // Update count
        } catch (error) {
            alert(error.response?.data?.error || "Error adding comment");
        }
    };

    const handleDeleteComentario = async (comentarioId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await axios.delete(`${API_URL}/comentarios/${comentarioId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComentarios();
            fetchJuego(); // Update count
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting comment");
        }
    };

    const handleReport = async () => {
        const motivo = window.prompt("Why is this game inappropriate?");
        if (!motivo) return;
        try {
            await axios.post(`${API_URL}/videojuegos/${id}/reportar`, { motivo }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Game reported successfully. Thank you!");
        } catch (error) {
            alert(error.response?.data?.error || "Error reporting game");
        }
    };

    const handleEliminar = async () => {
        if (!window.confirm("Are you sure you want to delete/hide this game?")) return;
        try {
            await axios.delete(`${API_URL}/videojuegos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/mis-juegos');
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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                    {juego.precio} €
                                </Typography>

                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ThumbUpIcon />}
                                        onClick={() => handleVote('like')}
                                        sx={{
                                            borderRadius: '20px',
                                            color: '#4caf50',
                                            borderColor: 'rgba(76, 175, 80, 0.3)',
                                            '&:hover': { borderColor: '#4caf50', background: 'rgba(76, 175, 80, 0.1)' }
                                        }}
                                    >
                                        {juego.likes || 0}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ThumbDownIcon />}
                                        onClick={() => handleVote('dislike')}
                                        sx={{
                                            borderRadius: '20px',
                                            color: '#f44336',
                                            borderColor: 'rgba(244, 67, 54, 0.3)',
                                            '&:hover': { borderColor: '#f44336', background: 'rgba(244, 67, 54, 0.1)' }
                                        }}
                                    >
                                        {juego.dislikes || 0}
                                    </Button>
                                </Stack>
                            </Box>

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

                            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
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

                                {user.role !== 'admin' && (
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<FlagIcon />}
                                        onClick={handleReport}
                                        sx={{
                                            borderRadius: '12px',
                                            borderColor: 'rgba(255, 152, 0, 0.3)',
                                            '&:hover': {
                                                borderColor: '#ff9800',
                                                background: 'rgba(255, 152, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        Report
                                    </Button>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            {/* Comments Section */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" sx={{ color: 'white', mb: 4, fontWeight: 700 }}>
                    Comments ({juego.commentsCount || 0})
                </Typography>

                <Paper sx={{
                    p: 3,
                    mb: 4,
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <form onSubmit={handleAddComentario}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Share your thoughts..."
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                    '&:hover fieldset': { borderColor: 'primary.main' },
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!nuevoComentario.trim()}
                            sx={{ borderRadius: '8px' }}
                        >
                            Post Comment
                        </Button>
                    </form>
                </Paper>

                <Stack spacing={3}>
                    {comentarios.map((coment) => (
                        <Paper key={coment.id} sx={{
                            p: 3,
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.9rem' }}>
                                        {coment.user?.username[0].toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{coment.user?.username}</Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                            {new Date(coment.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                {(user.username === coment.user?.username || user.role === 'admin') && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteComentario(coment.id)}
                                        sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', pl: 6 }}>
                                {coment.texto}
                            </Typography>
                        </Paper>
                    ))}
                    {comentarios.length === 0 && (
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', py: 4 }}>
                            No comments yet. Be the first to share!
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default DetailPage;
