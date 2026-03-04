import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Avatar,
    Tooltip
} from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <AppBar position="sticky" sx={{
            background: 'rgba(15, 12, 41, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'none'
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <SportsEsportsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#00d2ff' }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        VideoGamesApp
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        <Button
                            component={Link}
                            to="/"
                            startIcon={<CategoryIcon />}
                            sx={{ color: 'white', display: 'flex' }}
                        >
                            Catalog
                        </Button>
                        <Button
                            component={Link}
                            to="/mis-juegos"
                            startIcon={<PersonIcon />}
                            sx={{ color: 'white', display: 'flex' }}
                        >
                            Collection
                        </Button>
                        <Button
                            component={Link}
                            to="/nuevo"
                            startIcon={<AddCircleOutlineIcon />}
                            sx={{ color: 'white', display: 'flex' }}
                        >
                            New Game
                        </Button>
                        {user.role === 'admin' && (
                            <Button
                                component={Link}
                                to="/admin"
                                startIcon={<AdminPanelSettingsIcon />}
                                sx={{ color: '#ff9800', display: 'flex' }}
                            >
                                Admin
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                                {user.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                                {user.role}
                            </Typography>
                        </Box>

                        <Tooltip title="Logout">
                            <IconButton onClick={handleLogout} sx={{ color: '#ff4444' }} aria-label="Logout">
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
};

export default Navbar;
