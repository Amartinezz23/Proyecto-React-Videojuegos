import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from './Loading';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [reportedGames, setReportedGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReported = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/admin/reportados`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportedGames(response.data);
        } catch (error) {
            console.error("Error fetching reported games:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchReported();
    }, [token, user, navigate]);

    const handleDeleteGame = async (gameId) => {
        if (!window.confirm("Are you sure you want to PERMANENTLY delete this game? This action cannot be undone.")) return;
        try {
            await axios.delete(`${API_URL}/videojuegos/${gameId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchReported();
        } catch (error) {
            alert(error.response?.data?.error || "Error deleting game");
        }
    };

    if (loading) return <Loading />;

    return (
        <Box>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #fff, #ff9800)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Admin Dashboard
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                    Manage reported content and community safety.
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ background: 'rgba(255,255,255,0.05)' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Game</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Owner</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reports</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reasons</TableCell>
                            <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reportedGames.map((game) => (
                            <TableRow key={game.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar variant="rounded" src={game.urlImagen} sx={{ width: 40, height: 40 }} />
                                        <Typography sx={{ color: 'white', fontWeight: 600 }}>{game.nombre}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {game.user?.username || 'System'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${game.reportes.length} Reports`}
                                        color="error"
                                        size="small"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: '300px' }}>
                                    {game.reportes.map((r, i) => (
                                        <Typography key={i} variant="caption" display="block">
                                            • {r.motivo}
                                        </Typography>
                                    ))}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="View Details">
                                        <IconButton onClick={() => navigate(`/detalle/${game.id}`)} sx={{ color: '#00d2ff' }}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Permanently">
                                        <IconButton onClick={() => handleDeleteGame(game.id)} sx={{ color: '#f44336' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {reportedGames.length === 0 && (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            No reported games at the moment. Good job community!
                        </Typography>
                    </Box>
                )}
            </TableContainer>
        </Box>
    );
};

export default AdminDashboard;
